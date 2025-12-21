#!/usr/bin/env python3
"""Generate all required images for GirlPilates from logo.svg"""

import os
import cairosvg
from PIL import Image, ImageDraw, ImageFont
from io import BytesIO

# Paths
STATIC_DIR = "/home/user/girlpilates/static/images"
LOGO_SVG = os.path.join(STATIC_DIR, "logo.svg")

# Colors
PINK_PRIMARY = (219, 39, 119)  # #DB2777
PINK_DARK = (190, 24, 93)      # #BE185D
PINK_LIGHT = (253, 242, 248)   # #FDF2F8
WHITE = (255, 255, 255)

def svg_to_png(svg_path, output_path, width, height):
    """Convert SVG to PNG at specified size"""
    cairosvg.svg2png(
        url=svg_path,
        write_to=output_path,
        output_width=width,
        output_height=height
    )
    print(f"Created: {output_path}")

def create_gradient_background(width, height, color1, color2):
    """Create a vertical gradient background"""
    img = Image.new('RGB', (width, height))
    draw = ImageDraw.Draw(img)

    for y in range(height):
        ratio = y / height
        r = int(color1[0] * (1 - ratio) + color2[0] * ratio)
        g = int(color1[1] * (1 - ratio) + color2[1] * ratio)
        b = int(color1[2] * (1 - ratio) + color2[2] * ratio)
        draw.line([(0, y), (width, y)], fill=(r, g, b))

    return img

def create_og_image(output_path):
    """Create Open Graph image (1200x630) with gradient, logo, and text"""
    width, height = 1200, 630

    # Create gradient background
    img = create_gradient_background(width, height, PINK_PRIMARY, PINK_DARK)
    draw = ImageDraw.Draw(img)

    # Convert logo SVG to PNG in memory
    logo_png = cairosvg.svg2png(url=LOGO_SVG, output_width=200, output_height=200)
    logo = Image.open(BytesIO(logo_png)).convert('RGBA')

    # Center logo horizontally, place in upper third
    logo_x = (width - 200) // 2
    logo_y = 120
    img.paste(logo, (logo_x, logo_y), logo)

    # Add text - try to use a font, fallback to default
    try:
        title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 60)
        subtitle_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 32)
    except:
        title_font = ImageFont.load_default()
        subtitle_font = ImageFont.load_default()

    # Title
    title = "GirlPilates"
    title_bbox = draw.textbbox((0, 0), title, font=title_font)
    title_width = title_bbox[2] - title_bbox[0]
    draw.text(((width - title_width) // 2, 350), title, font=title_font, fill=WHITE)

    # Subtitle
    subtitle = "Free Pilates for Every Woman"
    subtitle_bbox = draw.textbbox((0, 0), subtitle, font=subtitle_font)
    subtitle_width = subtitle_bbox[2] - subtitle_bbox[0]
    draw.text(((width - subtitle_width) // 2, 430), subtitle, font=subtitle_font, fill=PINK_LIGHT)

    # Subtitle in Spanish
    subtitle_es = "Pilates Gratis para Todas las Mujeres"
    subtitle_es_bbox = draw.textbbox((0, 0), subtitle_es, font=subtitle_font)
    subtitle_es_width = subtitle_es_bbox[2] - subtitle_es_bbox[0]
    draw.text(((width - subtitle_es_width) // 2, 480), subtitle_es, font=subtitle_font, fill=PINK_LIGHT)

    img.save(output_path, 'JPEG', quality=90)
    print(f"Created: {output_path}")

def create_favicon_ico(logo_path, output_path):
    """Create multi-resolution favicon.ico"""
    # Create PNGs at different sizes
    sizes = [16, 32, 48]
    images = []

    for size in sizes:
        png_data = cairosvg.svg2png(url=logo_path, output_width=size, output_height=size)
        img = Image.open(BytesIO(png_data)).convert('RGBA')
        images.append(img)

    # Save as ICO with multiple sizes
    images[0].save(
        output_path,
        format='ICO',
        sizes=[(s, s) for s in sizes],
        append_images=images[1:]
    )
    print(f"Created: {output_path}")

def main():
    print("Generating images for GirlPilates...")
    print("-" * 40)

    # 1. Main logo PNG (512x512)
    svg_to_png(LOGO_SVG, os.path.join(STATIC_DIR, "logo.png"), 512, 512)

    # 2. Favicons
    svg_to_png(LOGO_SVG, os.path.join(STATIC_DIR, "favicon-16x16.png"), 16, 16)
    svg_to_png(LOGO_SVG, os.path.join(STATIC_DIR, "favicon-32x32.png"), 32, 32)
    svg_to_png(LOGO_SVG, os.path.join(STATIC_DIR, "apple-touch-icon.png"), 180, 180)

    # 3. Favicon ICO
    create_favicon_ico(LOGO_SVG, os.path.join(STATIC_DIR, "favicon.ico"))

    # 4. PWA icons
    pwa_sizes = [72, 96, 128, 144, 152, 192, 384, 512]
    for size in pwa_sizes:
        svg_to_png(LOGO_SVG, os.path.join(STATIC_DIR, f"icon-{size}x{size}.png"), size, size)

    # 5. Safari pinned tab (keep as SVG, just copy)
    # The logo.svg works for this purpose

    # 6. Open Graph image
    create_og_image(os.path.join(STATIC_DIR, "og-default.jpg"))

    print("-" * 40)
    print("All images generated successfully!")

if __name__ == "__main__":
    main()
