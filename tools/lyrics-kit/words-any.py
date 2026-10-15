"""Word timestamps — chay tren wav16k, bypass av hong. Dung chung moi project."""
import json, os, sys, wave
os.environ.setdefault("HF_HOME", r"D:\cache\hf-home")
import numpy as np
import faster_whisper.audio as FWA
import faster_whisper.transcribe as FWT
from faster_whisper import WhisperModel
from pathlib import Path

def decode_wav(path, sampling_rate=16000):
    with wave.open(path, "rb") as w:
        assert w.getnchannels() == 1 and w.getframerate() == sampling_rate, w.getparams()
        raw = w.readframes(w.getnframes())
    return (np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0)

FWA.decode_audio = decode_wav
FWT.decode_audio = decode_wav

proj = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(r"D:\test AI\uu-the-tin-hoc")
out = proj / "src" / "words"
out.mkdir(exist_ok=True)
model = WhisperModel("medium", device="cpu", compute_type="int8")
for wav in sorted((proj / "public" / "vo").glob("*.wav")):
    segs, _ = model.transcribe(str(wav), language="vi", word_timestamps=True, vad_filter=True)
    words = [{"text": w.word.strip(), "start": round(w.start, 2), "end": round(w.end, 2)}
             for s in segs for w in (s.words or [])
             if w.end > w.start and w.word.strip()]
    (out / (wav.stem + ".json")).write_text(json.dumps({"words": words}, ensure_ascii=False), encoding="utf-8")
    print(wav.stem, len(words), flush=True)
print("DONE")
