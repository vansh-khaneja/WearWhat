"""Category Classifier Module - handles classification/tagging of images for specific categories."""

from typing import List
import random


def tag_category(category_name: str, category_data: List[str], image_path: str = None) -> str:
    """Tag an image with a category from the given list. Returns formatted string: 'outfit with {category_name} as {value}'. Currently uses random selection - replace with CLIP/model."""
    # TODO: Implement the logic to tag the category using CLIP or other model
    # Use the image_path to tag the category
    
    # Dummy implementation - returns random choice
    tag = random.choice(category_data)
    
    # Format the output to match expected format
    return f"outfit with {category_name} as {tag}"

