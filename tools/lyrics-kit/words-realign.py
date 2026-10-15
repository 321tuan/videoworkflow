"""Can lyrics theo dung chu user danh (vo.json) — STT chi lay moc thoi gian.
Chay: python words-realign.py <project_dir>
"""
import difflib
import json
import glob
import os
import re
import sys

def norm(t):
    t = t.lower().replace("…", " ").replace(".", " ").replace(",", " ")
    t = re.sub(r"[?!:;\"'()]", " ", t)
    return t.split()

def tok_norm(t):
    # 1 token vao = 1 token ra (giu so luong de khong lech index voi script)
    return re.sub(r"[.…?!:;\"'()]", "", t).lower()

proj = sys.argv[1] if len(sys.argv) > 1 else r"D:\test AI\2k9-tin-hoc"
vo = json.load(open(os.path.join(proj, "src", "vo.json"), encoding="utf-8"))
override = json.loads(os.environ.get("WORDS_OVERRIDE_JSON") or "{}")
for key, text in vo["segments"].items():
    if key in override:
        text = override[key]
    fp = os.path.join(proj, "src", "words", key + ".json")
    if not os.path.exists(fp):
        print(key, "KHONG CO WORDS")
        continue
    try:
        stt = json.load(open(fp, encoding="utf-8"))["words"]
        script = text.split()
        a = [tok_norm(t) for t in script]
        b = [tok_norm(w["text"]) for w in stt]
        sm = difflib.SequenceMatcher(None, a, b, autojunk=False)
        out = []
        for tag, i1, i2, j1, j2 in sm.get_opcodes():
            i1, i2 = min(i1, len(script)), min(i2, len(script))
            j1, j2 = min(j1, len(stt)), min(j2, len(stt))
            if tag == "equal":
                for k in range(i2 - i1):
                    if j1 + k >= len(stt):
                        break
                    w = stt[j1 + k]
                    out.append({"text": script[i1 + k], "start": w["start"], "end": w["end"], "src": "stt"})
            else:
                # phan bo deu span STT cho cac tu script
                t0 = stt[j1]["start"] if j1 < len(stt) else (out[-1]["end"] if out else 0.0)
                t1 = stt[j2 - 1]["end"] if j2 > 0 and (j2 - 1) < len(stt) else t0
                n = max(i2 - i1, 1)
                for k in range(i2 - i1):
                    s = round(t0 + (t1 - t0) * k / n, 2)
                    e = round(t0 + (t1 - t0) * (k + 1) / n, 2)
                    out.append({"text": script[i1 + k], "start": s, "end": e, "src": "interp"})
        # sap xep + don dep
        out.sort(key=lambda w: (w["start"], w["end"]))
        json.dump({"words": out}, open(fp, "w", encoding="utf-8"), ensure_ascii=False)
        print(key, len(out), "tu")
    except Exception as e:
        print(key, "LOI:", str(e)[:150])
print("REALIGNED")
