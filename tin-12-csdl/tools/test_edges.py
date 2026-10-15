import os
from PIL import Image
import numpy as np
from scipy import ndimage

src_path = r"C:\Users\hoang\.gemini\antigravity-ide\brain\a08e4dd4-ea0f-4dec-b04c-b80473800648\.user_uploaded\media_1791822333472.jpg"
img = Image.open(src_path).convert("RGB")
w, h = img.size
arr = np.array(img, dtype=np.float32)

# Compute edge or color difference
# The background has high B (blue) and high G, but low saturation or pastel:
# B is high (180-255), R is (150-240), G is (180-255).
# Meanwhile dark outlines have low brightness:
brightness = (arr[:, :, 0] + arr[:, :, 1] + arr[:, :, 2]) / 3.0

# Gradients (edges)
gx = ndimage.sobel(brightness, axis=1)
gy = ndimage.sobel(brightness, axis=0)
edges = np.hypot(gx, gy)

print("Edges min, max, mean:", edges.min(), edges.max(), edges.mean())
