"""
Image Composer Module
Handles composing multiple outfit images into a single composite image.
"""

import os
import tempfile
import requests
from typing import List, Tuple
from PIL import Image, ImageDraw
import io

# Handle Pillow version compatibility
try:
    RESAMPLE = Image.Resampling.LANCZOS
except AttributeError:
    RESAMPLE = Image.LANCZOS


def download_image(url: str) -> Image.Image:
    """
    Download an image from a URL and return a PIL Image.
    
    Args:
        url: URL of the image to download.
        
    Returns:
        PIL Image object.
    """
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        image = Image.open(io.BytesIO(response.content))
        # Convert to RGB if necessary (handles RGBA, P, etc.)
        if image.mode != 'RGB':
            image = image.convert('RGB')
        return image
    except Exception as e:
        raise Exception(f"Failed to download image from {url}: {str(e)}")


def create_composite_image(image_urls: List[str], layout: str = "grid") -> Image.Image:
    """
    Create a composite image from multiple outfit images.
    
    Args:
        image_urls: List of image URLs to combine.
        layout: Layout style - "grid" (2x2) or "vertical" (stacked)
        
    Returns:
        PIL Image object of the composite.
    """
    if not image_urls:
        raise ValueError("No image URLs provided")
    
    # Download all images
    images = []
    for url in image_urls:
        try:
            img = download_image(url)
            images.append(img)
        except Exception as e:
            print(f"Warning: Failed to download image {url}: {e}")
            continue
    
    if not images:
        raise ValueError("No images could be downloaded")
    
    # Limit to 4 images for grid layout
    if layout == "grid" and len(images) > 4:
        images = images[:4]
    
    if layout == "grid":
        return _create_grid_layout(images)
    else:
        return _create_vertical_layout(images)


def _create_grid_layout(images: List[Image.Image]) -> Image.Image:
    """
    Create a 2x2 grid layout of images.
    
    Args:
        images: List of PIL Images (up to 4).
        
    Returns:
        Composite PIL Image.
    """
    # Ensure we have at least 1 and at most 4 images
    num_images = min(len(images), 4)
    images = images[:num_images]
    
    # Calculate grid dimensions
    if num_images == 1:
        cols, rows = 1, 1
    elif num_images == 2:
        cols, rows = 2, 1
    elif num_images == 3:
        cols, rows = 2, 2  # 2x2 grid with one empty space
    else:  # 4 images
        cols, rows = 2, 2
    
    # Resize all images to a consistent size
    cell_width = 600
    cell_height = 600
    padding = 20
    border_radius = 20
    
    # Resize images maintaining aspect ratio
    resized_images = []
    for img in images:
        # Resize maintaining aspect ratio, then center on white background
        img.thumbnail((cell_width - padding * 2, cell_height - padding * 2), RESAMPLE)
        
        # Create a white background with rounded corners
        bg = Image.new('RGB', (cell_width, cell_height), 'white')
        
        # Calculate position to center the image
        x_offset = (cell_width - img.width) // 2
        y_offset = (cell_height - img.height) // 2
        
        # Paste image on white background
        bg.paste(img, (x_offset, y_offset), img if img.mode == 'RGBA' else None)
        
        # Apply rounded corners
        bg = _apply_rounded_corners(bg, border_radius)
        resized_images.append(bg)
    
    # Create canvas
    canvas_width = cols * cell_width + padding * (cols + 1)
    canvas_height = rows * cell_height + padding * (rows + 1)
    canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')
    
    # Paste images onto canvas
    for idx, img in enumerate(resized_images):
        row = idx // cols
        col = idx % cols
        x = padding + col * (cell_width + padding)
        y = padding + row * (cell_height + padding)
        canvas.paste(img, (x, y))
    
    return canvas


def _create_vertical_layout(images: List[Image.Image]) -> Image.Image:
    """
    Create a vertical stacked layout of images.
    
    Args:
        images: List of PIL Images.
        
    Returns:
        Composite PIL Image.
    """
    # Resize all images to consistent width
    target_width = 600
    padding = 20
    border_radius = 20
    
    resized_images = []
    total_height = padding
    
    for img in images:
        # Resize maintaining aspect ratio
        aspect_ratio = img.height / img.width
        target_height = int(target_width * aspect_ratio)
        img_resized = img.resize((target_width, target_height), RESAMPLE)
        
        # Create white background with padding
        bg = Image.new('RGB', (target_width + padding * 2, target_height + padding * 2), 'white')
        bg.paste(img_resized, (padding, padding), img_resized if img_resized.mode == 'RGBA' else None)
        
        # Apply rounded corners
        bg = _apply_rounded_corners(bg, border_radius)
        resized_images.append(bg)
        total_height += bg.height + padding
    
    # Create canvas
    canvas_width = target_width + padding * 2
    canvas_height = total_height
    canvas = Image.new('RGB', (canvas_width, canvas_height), 'white')
    
    # Paste images vertically
    y_offset = padding
    for img in resized_images:
        x_offset = (canvas_width - img.width) // 2
        canvas.paste(img, (x_offset, y_offset))
        y_offset += img.height + padding
    
    return canvas


def _apply_rounded_corners(image: Image.Image, radius: int) -> Image.Image:
    """
    Apply rounded corners to an image.
    
    Args:
        image: PIL Image to modify.
        radius: Corner radius in pixels.
        
    Returns:
        PIL Image with rounded corners.
    """
    # Create a mask for rounded corners
    mask = Image.new('L', image.size, 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([(0, 0), image.size], radius, fill=255)
    
    # Apply mask if image has alpha channel, otherwise create new image with alpha
    if image.mode == 'RGBA':
        image.putalpha(mask)
    else:
        image = image.convert('RGBA')
        image.putalpha(mask)
    
    # Convert back to RGB for compatibility
    bg = Image.new('RGB', image.size, 'white')
    bg.paste(image, mask=image.split()[3])  # Use alpha channel as mask
    return bg

