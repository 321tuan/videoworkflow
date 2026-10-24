import re, os

pdf_path = r"D:\test AI\sách hướng dẫn ôn thi tin học.pdf"
out_dir = r"D:\test AI\tools\scanned_pages"

with open(pdf_path, "rb") as f:
    data = f.read()

jpeg_starts = [m.start() for m in re.finditer(b"\xff\xd8\xff", data)]

for i in range(8, 20):
    start = jpeg_starts[i]
    end = data.find(b"\xff\xd9", start)
    if end != -1:
        jpg_data = data[start:end+2]
        out_file = os.path.join(out_dir, f"page_{i+1}.jpg")
        with open(out_file, "wb") as img_f:
            img_f.write(jpg_data)
print("Extracted pages 9 to 20")
