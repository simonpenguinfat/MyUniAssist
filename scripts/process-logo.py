from PIL import Image
import os

src = r"C:\Users\Admin\.cursor\projects\c-Users-Admin-OneDrive-Desktop-project\assets\c__Users_Admin_AppData_Roaming_Cursor_User_workspaceStorage_12d2557d2347be0143b2202630f4f912_images_Screenshot_2026-09-05_at_9.23.22_PM-4f114276-ff37-486e-beb0-41cde6240a7d.png"
out_dir = r"C:\Users\Admin\OneDrive\Desktop\project\public"
os.makedirs(out_dir, exist_ok=True)

im = Image.open(src).convert("RGBA")
pixels = im.load()
w, h = im.size
print("size", w, h)

corners = [(0, 0), (w - 1, 0), (0, h - 1), (w - 1, h - 1), (w // 2, 0)]
for c in corners:
    print(c, pixels[c])

for y in range(h):
    for x in range(w):
        r, g, b, a = pixels[x, y]
        mx = max(r, g, b)
        mn = min(r, g, b)
        if r > 200 and g > 195 and b > 185 and (mx - mn) < 45:
            pixels[x, y] = (r, g, b, 0)
        elif r > 220 and g > 215 and b > 205:
            pixels[x, y] = (r, g, b, 0)
        elif r > 185 and g > 180 and b > 170 and (mx - mn) < 40:
            darkness = 255 - (r + g + b) / 3
            alpha = int(max(0, min(255, darkness * 3.2)))
            if alpha < 40:
                pixels[x, y] = (r, g, b, 0)
            else:
                pixels[x, y] = (r, g, b, alpha)

bbox = im.getbbox()
print("bbox", bbox)
im = im.crop(bbox)

pad = 8
padded = Image.new("RGBA", (im.width + pad * 2, im.height + pad * 2), (0, 0, 0, 0))
padded.paste(im, (pad, pad), im)

full = os.path.join(out_dir, "uniassist-logo.png")
padded.save(full, "PNG")
print("saved", full, padded.size)

arr = padded.load()
pw, ph = padded.size


def row_dark(y):
    c = 0
    for x in range(pw):
        r, g, b, a = arr[x, y]
        if a > 80 and (r + g + b) / 3 < 80:
            c += 1
    return c


mids = []
for y in range(int(ph * 0.35), int(ph * 0.75)):
    mids.append((row_dark(y), y))
mids.sort()
gap_y = mids[0][1]
print("gap_y", gap_y, "dark", mids[0][0])

icon = padded.crop((0, 0, pw, gap_y + 4))
ib = icon.getbbox()
if ib:
    icon = icon.crop(ib)
ipad = Image.new("RGBA", (icon.width + 8, icon.height + 8), (0, 0, 0, 0))
ipad.paste(icon, (4, 4), icon)
icon_path = os.path.join(out_dir, "uniassist-mark.png")
ipad.save(icon_path, "PNG")
print("saved", icon_path, ipad.size)
