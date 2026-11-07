"""Seamless background loops for the step-by-step player (erato, roemer, picard)."""
import numpy as np, wave, sys, subprocess
SR = 44100
def midi(n): return 440.0 * 2 ** ((n - 69) / 12)
NM = {'C':0,'D':2,'E':4,'F':5,'G':7,'A':9,'B':11}
def nn(s): return 12 * (int(s[-1]) + 1) + NM[s[0]] + (1 if '#' in s else 0)
class Loop:
    def __init__(s, dur): s.N = int(SR * dur); s.out = np.zeros(s.N)
    def add(s, t0, sig):
        i0 = int(t0 * SR) % s.N; n = len(sig); k = 0
        while k < n:
            m = min(n - k, s.N - i0); s.out[i0:i0+m] += sig[k:k+m]; k += m; i0 = 0
    def pluck(s, t0, note, amp, decay=1.2, bright=0.8, h=(0.45, 0.2, 0.08)):
        f = midi(nn(note)); t = np.arange(int(SR * decay * 2.0)) / SR
        env = np.exp(-t * (3.0 / decay)) * np.minimum(1, t / 0.003)
        sig = np.sin(2*np.pi*f*t) + h[0]*bright*np.sin(4*np.pi*f*t)*np.exp(-t*3) + h[1]*bright*np.sin(6*np.pi*f*t)*np.exp(-t*6) + h[2]*np.sin(8*np.pi*f*t)*np.exp(-t*10)
        s.add(t0, amp * env * sig)
    def pad(s, t0, dur, notes, amp):
        t = np.arange(int(SR * dur)) / SR; env = np.minimum(1, t / 1.2) * np.minimum(1, (dur - t) / 1.2)
        s.add(t0, amp * env * sum(np.sin(2*np.pi*midi(nn(x))*t) + 0.3*np.sin(4*np.pi*midi(nn(x))*t + 0.5) for x in notes) / len(notes))
    def flute(s, t0, note, dur, amp):
        f = midi(nn(note)); t = np.arange(int(SR * dur)) / SR
        env = np.minimum(1, t / 0.08) * np.minimum(1, (dur - t) / 0.25) ; vib = 1 + 0.004 * np.sin(2*np.pi*5.2*t) * np.minimum(1, t / 0.4)
        ph = 2*np.pi*f*np.cumsum(vib)/SR
        s.add(t0, amp * env * (np.sin(ph) + 0.18*np.sin(2*ph) + 0.06*np.sin(3*ph)))
    def save(s, path):
        o = s.out / (np.max(np.abs(s.out)) * 1.12)
        with wave.open(path, 'wb') as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((o * 32767).astype(np.int16).tobytes())

def erato():
    L = Loop(48.0)
    prog = [(['D3','A3'], ['D4','F4','A4','C5','A4','F4','E4','F4']), (['C3','G3'], ['C4','E4','G4','C5','G4','E4','D4','E4']),
            (['A#2','F3'], ['A#3','D4','F4','A4','F4','D4','C4','D4']), (['C3','G3'], ['C4','E4','G4','A4','G4','E4','G4','A4'])]
    B = 0.25
    for i in range(24):
        t = i * 2.0; bass, arp = prog[i % 4]
        L.pluck(t, bass[0], 0.16, decay=2.4, bright=0.4); L.pluck(t + 1.0, bass[1], 0.08, decay=1.6, bright=0.4)
        for k, n in enumerate(arp): L.pluck(t + k * B, n, 0.075 if k % 2 else 0.1, decay=1.2)
        L.pad(t, 2.6, [bass[0][:-1] + '4', arp[1], arp[2]], 0.028)
    return L
def roemer():
    L = Loop(57.6)
    prog = [('D3',['D4','F#4','A4','D5']), ('A2',['C#4','E4','A4','C#5']), ('B2',['D4','F#4','B4','D5']), ('F#2',['C#4','F#4','A4','C#5']),
            ('G2',['D4','G4','B4','D5']), ('D3',['D4','F#4','A4','D5']), ('G2',['D4','G4','B4','D5']), ('A2',['C#4','E4','A4','C#5'])]
    B = 0.15; pat = [0,1,2,3,2,1,2,1,0,1,2,3,2,3,2,1]
    for i in range(24):
        t = i * 16 * B; bass, arp = prog[i % 8]
        L.pluck(t, bass, 0.14, decay=1.6, bright=0.5, h=(0.6,0.35,0.2)); L.pluck(t + 8*B, bass, 0.08, decay=1.2, bright=0.5, h=(0.6,0.35,0.2))
        for j, p in enumerate(pat): L.pluck(t + j * B, arp[p], 0.07 if j % 2 else 0.09, decay=0.55, h=(0.6,0.35,0.2))
    return L
def picard():
    L = Loop(57.6)        # G major "air" in 3/4, lute + recorder
    prog = [('G2',['G3','B3','D4']), ('D3',['F#3','A3','D4']), ('E3',['G3','B3','E4']), ('B2',['F#3','B3','D4']),
            ('C3',['G3','C4','E4']), ('G2',['G3','B3','D4']), ('C3',['G3','C4','E4']), ('D3',['F#3','A3','D4'])]
    mel = [['B4','A4','G4'], ['A4','F#4','D4'], ['G4','B4','E5'], ['D5','C#5','B4'], ['C5','B4','A4'], ['B4','D5','G4'], ['E4','G4','C5'], ['A4','F#4','A4']]
    beat = 0.8
    for rep in range(3):
        for i in range(8):
            t = rep * 19.2 + i * 2.4; bass, ch = prog[i]
            L.pluck(t, bass, 0.15, decay=2.2, bright=0.35)
            for k in range(1, 3):
                for j, n in enumerate(ch): L.pluck(t + k*beat + j*0.05, n, 0.05, decay=1.0, bright=0.6)
            if rep > 0:
                for k, n in enumerate(mel[i]): L.flute(t + k*beat, n, beat*0.95, 0.045 if rep == 1 else 0.05)
            L.pad(t, 2.9, [ch[0], ch[1]], 0.02)
    return L
for name, fn in [('erato', erato), ('roemer', roemer), ('picard', picard)]:
    fn().save(f'{name}_loop.wav')
    subprocess.run(['ffmpeg','-y','-loglevel','error','-i',f'{name}_loop.wav','-ac','1','-c:a','libmp3lame','-b:a','80k',f'{name}_music.mp3'],check=True)
    print(name, 'ok')
