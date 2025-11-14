#!/usr/bin/env python3
"""
Generate favicon files from logo.png
Creates various formats and sizes required for modern web apps
"""

import os
from pathlib import Path
from PIL import Image

# Configuration
SCRIPT_DIR = Path(__file__).parent
PROJECT_ROOT = SCRIPT_DIR.parent
PUBLIC_DIR = PROJECT_ROOT / "public"
APP_DIR = PROJECT_ROOT / "app"
LOGO_PATH = PUBLIC_DIR / "logo.png"

# Favicon sizes to generate
FAVICON_SIZES = {
    "favicon-16x16.png": 16,
    "favicon-32x32.png": 32,
    "apple-touch-icon.png": 180,  # Apple touch icon
    "android-chrome-192x192.png": 192,
    "android-chrome-512x512.png": 512,
}

def generate_favicons():
    """Generate all favicon formats from logo.png"""
    
    if not LOGO_PATH.exists():
        print(f"Error: {LOGO_PATH} not found!")
        return False
    
    # Load the source image
    print(f"Loading source image: {LOGO_PATH}")
    img_original = Image.open(LOGO_PATH)
    
    # Ensure image is in RGBA format
    if img_original.mode != 'RGBA':
        if img_original.mode == 'P':
            img_original = img_original.convert('RGBA')
        elif img_original.mode in ('LA', 'L'):
            img_original = img_original.convert('RGBA')
        else:
            img_original = img_original.convert('RGBA')
    
    # Use app theme color: #063940 = rgba(6, 57, 64, 255)
    background_color_rgba = (6, 57, 64, 255)
    
    # Create version with background for RGB PNGs (for better compatibility)
    img_rgb = Image.new('RGB', img_original.size, background_color_rgba[:3])
    img_rgb.paste(img_original, mask=img_original.split()[-1])  # Use alpha channel as mask
    
    # Keep RGBA version for ICO (required for PNG compression in ICO)
    img_rgba = img_original.copy()
    
    # Generate PNG favicons (RGB format for better compatibility)
    print("\nGenerating PNG favicons...")
    for filename, size in FAVICON_SIZES.items():
        output_path = PUBLIC_DIR / filename
        resized = img_rgb.resize((size, size), Image.Resampling.LANCZOS)
        resized.save(output_path, "PNG", optimize=True)
        print(f"  ✓ Created {filename} ({size}x{size})")
    
    # Generate favicon.ico
    # Next.js/Turbopack has issues with multi-size ICO files, so we'll create a simple 32x32 ICO
    print("\nGenerating favicon.ico...")
    ico_size = 32  # Standard favicon size
    ico_img = img_rgba.resize((ico_size, ico_size), Image.Resampling.LANCZOS)
    
    # Ensure it's definitely RGBA
    if ico_img.mode != 'RGBA':
        ico_img = ico_img.convert('RGBA')
    
    # Save to public directory only
    # Note: We don't put favicon.ico in app/ directory to avoid Next.js/Turbopack processing issues
    # Instead, we reference it via metadata in layout.tsx
    ico_path_public = PUBLIC_DIR / "favicon.ico"
    
    # Save as simple single-size ICO
    ico_img.save(ico_path_public, format='ICO')
    print(f"  ✓ Created {ico_path_public} ({ico_size}x{ico_size})")
    
    # Generate site.webmanifest
    print("\nGenerating site.webmanifest...")
    manifest_content = """{
  "name": "Zendesk App Icon Generator",
  "short_name": "ZDK Icon Gen",
  "description": "Generate compliant Zendesk app icon bundles",
  "icons": [
    {
      "src": "/android-chrome-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/android-chrome-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ],
  "theme_color": "#063940",
  "background_color": "#063940",
  "display": "standalone",
  "start_url": "/"
}
"""
    manifest_path = PUBLIC_DIR / "site.webmanifest"
    with open(manifest_path, 'w') as f:
        f.write(manifest_content)
    print(f"  ✓ Created site.webmanifest")
    
    print("\n✅ All favicon files generated successfully!")
    return True

if __name__ == "__main__":
    try:
        generate_favicons()
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
        exit(1)

