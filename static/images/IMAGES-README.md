# Required Images for GirlPilates

## Essential Images (Must Have Before Launch)

### Social Sharing
- `og-default.jpg` - 1200x630px - Default Open Graph image for social sharing
  - Should include logo, tagline, pink gradient background

### Favicons (Required for Browser)
- `favicon.ico` - 32x32 multi-resolution ICO file
- `favicon-16x16.png` - 16x16px PNG
- `favicon-32x32.png` - 32x32px PNG
- `apple-touch-icon.png` - 180x180px PNG for iOS

### PWA Icons (Required for manifest.json)
- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

### Brand Assets
- `logo.svg` - Vector logo (created)
- `logo.png` - 512x512px PNG version
- `safari-pinned-tab.svg` - Monochrome SVG for Safari

## Color Palette
- Primary Pink: #DB2777
- Dark Pink: #BE185D
- Light Pink: #FDF2F8
- White: #FFFFFF

## Generating Icons

Use a tool like https://realfavicongenerator.net/ with the logo.svg to generate all required sizes.

Or use ImageMagick:
```bash
# Generate PNG from SVG
convert logo.svg -resize 512x512 logo.png

# Generate favicons
convert logo.png -resize 32x32 favicon-32x32.png
convert logo.png -resize 16x16 favicon-16x16.png
convert logo.png -resize 180x180 apple-touch-icon.png

# Generate PWA icons
for size in 72 96 128 144 152 192 384 512; do
  convert logo.png -resize ${size}x${size} icon-${size}x${size}.png
done
```
