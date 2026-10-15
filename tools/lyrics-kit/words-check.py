"""Kiem tra words truoc render: khe cau dinh + ten rieng + chunk qua ngan.
Dung: python words-check.py <project_dir>  (exit 1 = co loi can sua)
"""
import json, glob, os, sys

WATCH = ["mill", "neweducation", "neareducation", "hót", "tím.", "thần thư", "tiên học", "tinh học"]

proj = sys.argv[1] if len(sys.argv) > 1 else r"D:\test AI\2k9-tin-hoc"
bad = 0
for f in sorted(glob.glob(os.path.join(proj, "src", "words", "*.json"))):
    d = json.load(open(f, encoding="utf-8"))
    ws = d["words"]
    k = os.path.basename(f)
    for w in ws:
        if any(s in w["text"].lower() for s in WATCH):
            print(f"{k}: TEN SAI '{w['text']}' @ {w['start']}s")
            bad += 1
    for i in range(len(ws) - 1):
        if ws[i]["text"][-1:] in ".…?!" and ws[i].get("src", "stt") == "stt" and ws[i + 1].get("src", "stt") == "stt" and ws[i + 1]["start"] - ws[i]["end"] < 0.25:
            print(f"{k}: DINH '{ws[i]['text']}' gap {round(ws[i+1]['start']-ws[i]['end'],2)}s")
            bad += 1
print("words-check:", "FAIL" if bad else "PASS", f"({bad} loi)")
sys.exit(1 if bad else 0)
