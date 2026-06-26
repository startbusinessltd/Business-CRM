from PIL import Image
import os

SRC = r"C:\Users\Archana\.cursor\projects\c-Users-Archana-Videos-StartBusiness-frontend\assets\c__Users_Archana_AppData_Roaming_Cursor_User_workspaceStorage_ec4c3f11749456741fbe6c02d1abb23f_images_WhatsApp_Image_2026-06-15_at_10.37.41_AM-f547ce90-e4ca-44b8-839c-7de6a94c58c9.png"

OUT_DIRS = [
    r"c:\Users\Archana\Videos\StartBusiness\frontend\Business-CRM\public",
    r"c:\Users\Archana\Videos\StartBusiness\frontend\startbusinessltd-ui\public",
]

# Match original favicon mark size (~75% of canvas, not edge-to-edge).
LOGO_SCALE = 0.85

SIZES = {
    "favicon.png": 32,
    "favicon-32x32.png": 32,
    "favicon-48x48.png": 48,
    "favicon-64x64.png": 64,
    "favicon-192x192.png": 192,
    "apple-touch-icon.png": 180,
}


def remove_white(img: Image.Image) -> Image.Image:
    img = img.convert("RGBA")
    px = img.load()
    w, h = img.size

    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            brightness = max(r, g, b)
            whiteness = min(r, g, b)
            if brightness >= 235 and (brightness - whiteness) <= 18:
                px[x, y] = (r, g, b, 0)
            elif brightness >= 220 and (brightness - whiteness) <= 25:
                alpha = int(255 * (235 - brightness) / 15)
                px[x, y] = (r, g, b, max(0, min(255, alpha)))

    bbox = img.getbbox()
    return img.crop(bbox) if bbox else img


def make_icon(master: Image.Image, size: int) -> Image.Image:
    target = max(1, int(size * LOGO_SCALE))
    resized = master.copy()
    resized.thumbnail((target, target), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ox = (size - resized.width) // 2
    oy = (size - resized.height) // 2
    canvas.paste(resized, (ox, oy), resized)
    return canvas


def main():
    master = remove_white(Image.open(SRC))

    for out_dir in OUT_DIRS:
        for name, size in SIZES.items():
            icon = make_icon(master, size)
            icon.save(os.path.join(out_dir, name), "PNG", optimize=True)
            print(f"saved {out_dir}\\{name}")

    master_path = os.path.join(OUT_DIRS[0], "logo-transparent.png")
    master.save(master_path, "PNG", optimize=True)
    print(f"saved {master_path}")


if __name__ == "__main__":
    main()
