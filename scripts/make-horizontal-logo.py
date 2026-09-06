from PIL import Image
import os

logo = Image.open("public/uniassist-logo.png").convert("RGBA")
mark = Image.open("public/uniassist-mark.png").convert("RGBA")
print("logo", logo.size, "mark", mark.size)

# Find wordmark band: lower portion of full logo after the gap
arr = logo.load()
w, h = logo.size


def row_ink(y):
    c = 0
    for x in range(w):
        r, g, b, a = arr[x, y]
        if a > 40 and (r + g + b) / 3 < 120:
            c += 1
    return c


# Find sparsest row between mid icon and text
scores = [(row_ink(y), y) for y in range(int(h * 0.4), int(h * 0.85))]
scores.sort()
gap = scores[0][1]
print("gap", gap, "ink", scores[0][0])

# Wordmark starts shortly after gap
start = gap
while start < h and row_ink(start) < 8:
    start += 1
end = h - 1
while end > start and row_ink(end) < 8:
    end -= 1
word = logo.crop((0, start - 2, w, end + 3))
wb = word.getbbox()
if wb:
    word = word.crop(wb)
print("word", word.size)
word.save("public/uniassist-wordmark.png")

# Horizontal lockup: mark | gap | wordmark, vertically centered
mh, mw = mark.height, mark.width
# Scale mark and word to same height
target_h = 160
mark_s = mark.resize(
    (int(mw * target_h / mh), target_h), Image.Resampling.LANCZOS
)
wh, ww = word.height, word.width
word_s = word.resize(
    (int(ww * target_h / wh), target_h), Image.Resampling.LANCZOS
)
gap_px = 28
out_w = mark_s.width + gap_px + word_s.width
out_h = target_h + 16
out = Image.new("RGBA", (out_w, out_h), (0, 0, 0, 0))
y0 = 8
out.paste(mark_s, (0, y0), mark_s)
out.paste(word_s, (mark_s.width + gap_px, y0), word_s)
out_path = "public/uniassist-logo.png"
out.save(out_path)
print("saved horizontal", out_path, out.size)

# Keep mark as-is; update BrandLogo sizes later
