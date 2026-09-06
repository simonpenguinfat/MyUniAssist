"""Re-export a larger, cleaner PNG mark from the original screenshot for fallback use."""
from PIL import Image, ImageFilter

src = r"C:\Users\Admin\.cursor\projects\c-Users-Admin-OneDrive-Desktop-project\assets\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_12d2557d2347be0143b2202630f4f912_images_Screenshot_2026-09-05_at_9.23.22_PM-4f114276-ff37-486e-beb0-41cde6240a7d.png"
im = Image.open(src).convert("RGBA")
pixels = im.load()
w, h = im.size

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        mx = max(r, g, b)
        mn = min(r, g, b)
        # Paper / cream bg -> transparent
        if r > 190 and g > 185 and b > 175 and (mx - mn) < 50:
            pixels[x, y] = (0, 0, 0, 0)
        elif r > 210 and g > 205 and b > 195:
            pixels[x, y] = (0, 0, 0, 0)

bbox = im.getbbox()
im = im.crop(bbox)
pw, ph = im.size
arr = im.load()


def row_ink(y):
    c = 0
    for x in range(pw):
        r, g, b, a = arr[x, y]
        if a > 60 and (r + g + b) / 3 < 100:
            c += 1
    return c


scores = [(row_ink(y), y) for y in range(int(ph * 0.35), int(ph * 0.8))]
scores.sort()
gap = scores[0][1]
mark = im.crop((0, 0, pw, gap + 2))
mb = mark.getbbox()
if mb:
    mark = mark.crop(mb)

# Upscale 2x with LANCZOS then slight unsharp for clarity at display sizes
mark = mark.resize((mark.width * 2, mark.height * 2), Image.Resampling.LANCZOS)
mark = mark.filter(ImageFilter.UnsharpMask(radius=1.2, percent=140, threshold=2))

pad = 12
out = Image.new("RGBA", (mark.width + pad * 2, mark.height + pad * 2), (0, 0, 0, 0))
out.paste(mark, (pad, pad), mark)
out.save("public/uniassist-mark.png", "PNG", optimize=True)
print("saved mark", out.size)
