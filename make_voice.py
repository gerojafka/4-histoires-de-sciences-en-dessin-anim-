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
  --pause 1.2         seconds to wait between Google requests (default 1.2)
"""
import argparse, pathlib, re, sys, time

try:                                   # never crash on a Windows console that can't print accents
    sys.stdout.reconfigure(errors="replace")
except Exception:
    pass

HERE = pathlib.Path(__file__).resolve().parent
SRC = HERE / "src"
OUT = HERE / "assets" / "voice"

# Google voice settings. 'tld' picks the regional accent of Google Translate:
#   French: "fr" (France), "ca" (Canada)      English: "com" (US), "co.uk" (UK), "com.au" (Australia)
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


def main():
    ap = argparse.ArgumentParser(description="Generate the voice-over MP3 files with Google's voice.")
    ap.add_argument("--lang", choices=["fr", "en", "both"], default="both")
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--force", action="store_true")
    ap.add_argument("--pause", type=float, default=1.2)
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

    try:
        from gtts import gTTS
    except ImportError:
        sys.exit("The gTTS package is missing. Install it with:   py -m pip install gTTS")

    failed = []
    for n, (lg, raw, path, fname) in enumerate(todo, 1):
        path.parent.mkdir(parents=True, exist_ok=True)
        text = spoken(raw, lg)
        for attempt in range(1, 5):
            try:
                v = VOICES[lg]
                gTTS(text=text, lang=v["lang"], tld=v["tld"], slow=False).save(str(path))
                print(f"[{n}/{len(todo)}] {lg} {path.name}  {path.stat().st_size // 1024} KB  {text[:55]}")
                break
            except Exception as e:
                if path.exists():
                    path.unlink()
                wait = 5 * attempt
                print(f"   attempt {attempt} failed ({type(e).__name__}); waiting {wait}s")
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
