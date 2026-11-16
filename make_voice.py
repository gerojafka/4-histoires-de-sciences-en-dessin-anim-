#!/usr/bin/env python3
"""
make_voice.py - generates the voice-over MP3 files (Google voice) for the 4 stories.

HOW TO USE (Windows):
  Double-click  make_voice.bat   (it installs gTTS, then runs this script)
  or, in a terminal:   py -m pip install gTTS   then   py make_voice.py

What it does:
  * reads every caption (French + English) from the files in  src/
  * asks Google Translate's text-to-speech for each one  (needs an internet connection)
  * saves the files in  assets/voice/fr/  and  assets/voice/en/
  * the page picks them up by itself; a caption with no MP3 is read by the browser voice instead

It can be stopped and restarted at any time: files that already exist are skipped.
After it finishes, commit and push the new  assets/voice  folder to GitHub with the rest.

Options:
  --lang fr|en|both   which language to generate (default: both)
  --dry-run           only list what would be generated, no download
  --force             regenerate files that already exist
  --engine cloud|gtts|edge   voice source (default auto: Google Cloud if google_tts_key.txt exists, else gTTS)
  --voice-fr / --voice-en    pick another voice name (e.g. fr-FR-Neural2-A)
  --pause 1.2         seconds to wait between Google requests (default 1.2)
"""
import argparse, base64, json, os, pathlib, re, sys, time, urllib.request, urllib.error

try:                                   # never crash on a Windows console that can't print accents
    sys.stdout.reconfigure(errors="replace")
except Exception:
    pass

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "src"
OUT = HERE / "assets" / "voice"

# Google voice settings. 'tld' picks the regional accent of Google Translate:
#   French: "fr" (France), "ca" (Canada)      English: "com" (US), "co.uk" (UK), "com.au" (Australia)
# Better quality: Google Cloud Text-to-Speech (needs a free API key, see google_tts_key.txt below).
#   "Chirp3-HD" = Google's newest, most natural voices. Other choices: fr-FR-Neural2-A/B, en-US-Neural2-F/J, en-US-Studio-O
CLOUD_VOICES = {"fr": ("fr-FR", "fr-FR-Chirp3-HD-Aoede"), "en": ("en-US", "en-US-Chirp3-HD-Aoede")}
EDGE_VOICES = {"fr": "fr-FR-DeniseNeural", "en": "en-US-AriaNeural"}   # free Microsoft neural voices, no key needed

VOICES = {
    "fr": {"lang": "fr", "tld": "fr"},
    "en": {"lang": "en", "tld": "com"},
}

# ---- must stay identical to the page (VSYM in src/shell.js): how symbols are read aloud ----
VSYM = {
    "fr": [("≈", " environ "), ("×", " fois "), ("=", " égale "), ("+", " plus "), (r"−\s?", " moins "),
           ("°", " degrés "), ("′", " minutes "), ("″", " secondes "), ("→", ", "), ("½", " et demi")],
    "en": [("≈", " about "), ("×", " times "), ("=", " equals "), ("+", " plus "), (r"−\s?", " minus "),
           ("°", " degrees "), ("′", " minutes "), ("″", " seconds "), ("→", ", "), ("½", " and a half")],
}


def spoken(text, lg):
    for pat, rep in VSYM[lg]:
        text = re.sub(pat if pat.startswith("−") else re.escape(pat), rep, text)
    return re.sub(r"\s+", " ", text).strip()


def vhash(text):
    """FNV-1a 32-bit over the UTF-8 bytes; the page computes the very same value."""
    h = 0x811C9DC5
    for b in text.encode("utf-8"):
        h = ((h ^ b) * 0x01000193) & 0xFFFFFFFF
    return f"{h:08x}"


STR = r"'((?:[^'\\]|\\.)*)'"


def unescape(s):
    return re.sub(r"\\(.)", lambda m: "\n" if m.group(1) == "n" else m.group(1), s)


def captions():
    """Returns the ordered list of unique (fr, en) captions found in src/*.js."""
    found, seen = [], set()
    pats = [
        # step stories:  caps:[[0.4,{fr:'...',en:'...'}], ...]
        re.compile(r"\[\s*[\d.]+\s*,\s*\{\s*fr:\s*" + STR + r"\s*,\s*en:\s*" + STR + r"\s*\}\s*\]"),
        # film stories:  caption(t, from, to, 'fr', 'en')
        re.compile(r"caption\(\s*t\s*,[^'\"`]*?," + r"\s*" + STR + r"\s*,\s*" + STR + r"\s*\)"),
    ]
    for f in sorted(SRC.glob("*.js")):
        if f.name == "shell.js":
            continue
        text = f.read_text(encoding="utf-8")
        for pat in pats:
            for m in pat.finditer(text):
                fr, en = unescape(m.group(1)), unescape(m.group(2))
                if (fr, en) not in seen:
                    seen.add((fr, en)); found.append((f.name, fr, en))
    return found


def api_key():
    k = os.environ.get("GOOGLE_TTS_KEY", "").strip()
    f = HERE / "google_tts_key.txt"
    if not k and f.exists():
        k = f.read_text(encoding="utf-8").strip()
    return k


def synth_cloud(text, lg, path, key, voice):
    code, name = CLOUD_VOICES[lg]
    if voice:
        name = voice
        code = "-".join(name.split("-")[:2])
    body = json.dumps({"input": {"text": text}, "voice": {"languageCode": code, "name": name},
                       "audioConfig": {"audioEncoding": "MP3", "speakingRate": 0.97}}).encode()
    req = urllib.request.Request("https://texttospeech.googleapis.com/v1/text:synthesize?key=" + key, body,
                                 {"Content-Type": "application/json"})
    try:
        data = json.load(urllib.request.urlopen(req, timeout=60))
    except urllib.error.HTTPError as e:
        raise RuntimeError(e.read().decode("utf-8", "replace")[:300])
    path.write_bytes(base64.b64decode(data["audioContent"]))


def synth_edge(text, lg, path, voice):
    import asyncio, edge_tts
    asyncio.run(edge_tts.Communicate(text, voice or EDGE_VOICES[lg]).save(str(path)))


def main():
    ap = argparse.ArgumentParser(description="Generate the voice-over MP3 files with Google's voice.")
    ap.add_argument("--lang", choices=["fr", "en", "both"], default="both")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--pause", type=float, default=1.2)
    ap.add_argument("--engine", choices=["auto", "cloud", "gtts", "edge"], default="auto",
                    help="cloud = Google Cloud TTS (best, needs key); gtts = Google Translate voice; edge = Microsoft neural voices; auto = cloud if a key is found, else gtts")
    ap.add_argument("--voice-fr", default=None, help="e.g. fr-FR-Neural2-A")
    ap.add_argument("--voice-en", default=None, help="e.g. en-US-Studio-O")
    a = ap.parse_args()

    caps = captions()
    if not caps:
        sys.exit("No captions found in src/ - run this script from the project folder.")
    langs = ["fr", "en"] if a.lang == "both" else [a.lang]
    jobs = []
    for lg in langs:
        for fname, fr, en in caps:
            raw = fr if lg == "fr" else en
            jobs.append((lg, raw, OUT / lg / f"{vhash(raw)}.mp3", fname))
    todo = [j for j in jobs if a.force or not j[2].exists()]
    print(f"{len(caps)} captions x {len(langs)} language(s) = {len(jobs)} files; {len(jobs) - len(todo)} already done, {len(todo)} to generate.")
    if a.dry_run:
        for lg, raw, path, fname in todo[:12]:
            print(f"  [{lg}] {path.name}  <- {raw[:70]}")
        if len(todo) > 12:
            print(f"  ... and {len(todo) - 12} more")
        return
    if not todo:
        print("Nothing to do."); return

    key = api_key()
    engine = a.engine if a.engine != "auto" else ("cloud" if key else "gtts")
    print("Voice engine:", engine)
    if engine == "cloud" and not key:
        sys.exit("No Google API key. Put it in a file named google_tts_key.txt next to this script (see the instructions).")
    if engine == "gtts":
        try:
            from gtts import gTTS
        except ImportError:
            sys.exit("The gTTS package is missing. Install it with:   py -m pip install gTTS")
    if engine == "edge":
        try:
            import edge_tts
        except ImportError:
            sys.exit("Install it with:   py -m pip install edge-tts")
    vname = {"fr": a.voice_fr, "en": a.voice_en}

    failed = []
    for n, (lg, raw, path, fname) in enumerate(todo, 1):
        path.parent.mkdir(parents=True, exist_ok=True)
        text = spoken(raw, lg)
        for attempt in range(1, 5):
            try:
                if engine == "cloud":
                    synth_cloud(text, lg, path, key, vname[lg])
                elif engine == "edge":
                    synth_edge(text, lg, path, vname[lg])
                else:
                    v = VOICES[lg]
                    gTTS(text=text, lang=v["lang"], tld=v["tld"], slow=False).save(str(path))
                print(f"[{n}/{len(todo)}] {lg} {path.name}  {path.stat().st_size // 1024} KB  {text[:55]}")
                break
            except Exception as e:
                if path.exists():
                    path.unlink()
                wait = 5 * attempt
                print(f"   attempt {attempt} failed ({type(e).__name__}: {str(e)[:200]}); waiting {wait}s")
                if engine == "cloud" and ("API key" in str(e) or "PERMISSION" in str(e) or "not enabled" in str(e)):
                    sys.exit("Google refused the key: check that 'Cloud Text-to-Speech API' is enabled for it.")
                time.sleep(wait)
        else:
            failed.append((lg, raw))
        time.sleep(a.pause)

    total = sum(p.stat().st_size for p in OUT.rglob("*.mp3")) / 1e6
    print(f"\nDone. {len(todo) - len(failed)} generated, {len(failed)} failed. assets/voice is now {total:.1f} MB.")
    if failed:
        print("Run the script again to retry the failed ones (existing files are skipped).")


if __name__ == "__main__":
    main()
