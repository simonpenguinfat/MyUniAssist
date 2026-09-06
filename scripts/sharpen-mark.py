"""Re-crop original logo mark with transparent bg — preserve artwork, improve clarity only."""
from PIL import Image, ImageFilter, ImageEnhance

src = r"C:\Users\Admin\.cursor\projects\c-Users-Admin-OneDrive-Desktop-project\assets\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_12d2557d2347be0143b2202630f4f912_images_Screenshot_2026-09-05_at_9.23.22_PM-4f114276-ff37-486e-beb0-41cde6240a7d.png"
im = Image.open(src).convert("RGBA")
pixels = im.load()
w, h = im.size

# Remove paper background only — keep original navy/cyan pixels intact
for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        mx = max(r, g, b)
        mn = min(r, g, b)
        avg = (r + g + b) / 3
        # Light paper / cream
        if avg > 215 and (mx - mn) < 40:
            pixels[x, y] = (0, 0, 0, 0)
        elif avg > 200 and (mx - mn) < 35 and r > 195 and g > 190 and b > 180:
            # Soft fringe: fade rather than hard cut so edges stay clean
            strength = (avg - 180) / 75
            alpha = int(max(0, min(255, 255 * (1 - strength))))
            if alpha < 20:
                pixels[x, y] = (0, 0, 0, 0)
            else:
                pixels[x, y] = (r, g, b, alpha)

bbox = im.getbbox()
im = im.crop(bbox)
pw, ph = im.size
arr = im.load()


def row_ink(y):
    c = 0
    for x in range(pw):
        r, g, b, a = arr[x, y]
        if a > 70 and (r + g + b) / 3 < 110:
            c += 1
    return c


scores = [(row_ink(y), y) for y in range(int(ph * 0.35), int(ph * 0.8))]
scores.sort()
gap = scores[0][1]
mark = im.crop((0, 0, pw, max(gap - 4, 1)))
mb = mark.getbbox()
if mb:
    mark = mark.crop(mb)

# Upscale 3x for retina clarity (same artwork, more pixels)
mark = mark.resize((mark.width * 3, mark.height * 3), Image.Resampling.LANCZOS)
# Gentle unsharp — clearer, not a different look
mark = mark.filter(ImageFilter.UnsharpMask(radius=1.0, percent=110, threshold=3))
# Tiny contrast bump for definition
mark = ImageEnhance.Contrast(mark).enhance(1.06)

pad = 16
out = Image.new("RGBA", (mark.width + pad * 2, mark.height + pad * 2), (0, 0, 0, 0))
out.paste(mark, (pad, pad), mark)
out.save("public/uniassist-mark.png", "PNG", optimize=False, compress_level=1)
print("saved", out.size)
