import os
from PIL import Image
import numpy as np
from scipy import ndimage

src_path = r"C:\Users\hoang\.gemini\antigravity-ide\brain\a08e4dd4-ea0f-4dec-b04c-b80473800648\.user_uploaded\media_1791822333472.jpg"
out_dir = r"d:\test AI\tin-12-csdl\public\img"
os.makedirs(out_dir, exist_ok=True)
out_path = os.path.join(out_dir, "canh-cut.png")

img = Image.open(src_path).convert("RGB")
arr = np.array(img, dtype=np.float32) # shape (H, W, 3)
H, W, _ = arr.shape

# Let's inspect colors along the outer border
top_border = arr[0:15, :, :]
bottom_border = arr[-15:, :, :]
left_border = arr[:, 0:15, :]
right_border = arr[:, -15:, :]

border_pixels = np.vstack([
    top_border.reshape(-1, 3),
    bottom_border.reshape(-1, 3),
    left_border.reshape(-1, 3),
    right_border.reshape(-1, 3)
])

mean_bg = np.median(border_pixels, axis=0)
print("Median border color:", mean_bg)

# Background has:
# R in [130, 255], G in [180, 255], B in [230, 255]
# And (B - R) is between 10 and 110, B >= G >= R
# Penguin features:
# - Black body: R < 70, G < 70, B < 70 -> diff from bg > 150
# - Orange feet: R > 200, G ~ 170, B < 80 -> B is very low!
# - White belly/face: completely inside the black body
# - Blue backpack: R ~ 30-70, G ~ 70-120, B ~ 150-200 -> dark blue, B - R > 100, but R < 80
# - 4 exclamation marks: R ~ 20-50, G ~ 120-170, B ~ 230-255 -> bright cyan-blue

# Let's check distance to background color space
# Notice: background color is mostly light blue/white with low saturation:
# Specifically, for background: (R > 130 and G > 175 and B > 215)
is_bg_color = (arr[:, :, 0] > 120) & (arr[:, :, 1] > 165) & (arr[:, :, 2] > 205)

# But wait! Penguin's white face and belly also have high R, G, B!
# However, penguin's white face/belly are NOT connected to image borders!
# If we flood-fill / label connected components from borders:
from scipy.ndimage import label

# Label the background-colored pixels:
labeled_bg, num_features = label(is_bg_color)

# Find labels that touch the border:
border_mask = np.zeros((H, W), dtype=bool)
border_mask[0, :] = True
border_mask[-1, :] = True
border_mask[:, 0] = True
border_mask[:, -1] = True

border_labels = set(np.unique(labeled_bg[border_mask]))
if 0 in border_labels:
    border_labels.remove(0)

# True background mask is any component that touches the border
bg_mask = np.isin(labeled_bg, list(border_labels))

# Dilate slightly and fill holes
print("BG mask fraction:", np.mean(bg_mask))

# Foreground is NOT bg_mask:
fg_mask = ~bg_mask

# Keep largest foreground component (the penguin)
labeled_fg, num_fg = label(fg_mask)
fg_sizes = ndimage.sum(fg_mask, labeled_fg, range(num_fg + 1))
print("FG sizes top 5:", sorted(fg_sizes, reverse=True)[:5])

# Also keep components that are near the penguin (like the 4 blue marks)
# Penguin is the largest component:
main_fg_label = np.argmax(fg_sizes)
penguin_mask = (labeled_fg == main_fg_label)

# Any other component with size > 200 (e.g. the 4 exclamation marks)
for lbl, sz in enumerate(fg_sizes):
    if sz > 150 and lbl != 0:
        penguin_mask |= (labeled_fg == lbl)

# Smooth edges slightly
# Binary closing to close small holes inside
penguin_mask = ndimage.binary_fill_holes(penguin_mask)

# Save result with alpha
rgba = np.zeros((H, W, 4), dtype=np.uint8)
rgba[:, :, :3] = np.array(img)
rgba[:, :, 3] = (penguin_mask * 255).astype(np.uint8)

res_img = Image.fromarray(rgba)
res_img.save(out_path)
print("Saved to:", out_path)
