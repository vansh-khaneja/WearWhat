"""
Category Classifier Module
Handles the classification/tagging of images for specific categories.
Currently uses a dummy random function - replace with actual CLIP/model implementation.
"""

from typing import List
import random


def tag_category(category_name: str, category_data: List[str], image_path: str = None) -> str:
    """
    Tag an image with a category from the given list of options.
    
    Args:
        category_name: Name of the category being tagged (e.g., "Category", "color", "neckline")
        category_data: List of possible category values to choose from
        image_path: Path to the image file (local path or URL)
        
    Returns:
        Selected category value (formatted as "outfit with {category_name} as {value}")
        
    Note:
        This is currently a dummy function that returns random values.
        Replace with actual CLIP or model-based classification.
    """
    # TODO: Implement the logic to tag the category using CLIP or other model
    # Use the image_path to tag the category
    
    # Dummy implementation - returns random choice
    tag = random.choice(category_data)
    
    # Format the output to match expected format
    return f"outfit with {category_name} as {tag}"

