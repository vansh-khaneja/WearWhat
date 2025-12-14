"""
Image Tagger Module
Handles the complete tagging workflow for fashion images.
"""

import json
from typing import Dict
from pathlib import Path

from image_tagging.classifier import tag_category


def _load_tag_configs(tags_dir: str = "tags") -> Dict:
    """Load all tag configuration files."""
    tags_path = Path(tags_dir)
    
    # Load categories
    with open(tags_path / "categories.json", "r") as f:
        categories_data = json.load(f)
    
    # Load specific attributes
    with open(tags_path / "specific_attributes.json", "r") as f:
        specific_attributes_data = json.load(f)
    
    # Load generic attributes
    with open(tags_path / "generic_attributes.json", "r") as f:
        generic_attributes_data = json.load(f)
    
    return {
        "categories": categories_data,
        "specific_attributes": specific_attributes_data,
        "generic_attributes": generic_attributes_data
    }


def _extract_category_value(formatted_label: str) -> str:
    """Extract category value from formatted label (e.g., 'outfit with Category as upperWear' -> 'upperWear')."""
    if " as " in formatted_label:
        return formatted_label.split(" as ")[-1]
    return formatted_label


def _tag_category_group(image_path: str, categories_data: Dict) -> str:
    """Tag the category group (e.g., upperWear, bottomWear)."""
    category_keys = list(categories_data["categoryGroups"].keys())
    category_name_formatted = tag_category("Category", category_keys, image_path)
    category_name = _extract_category_value(category_name_formatted)
    return category_name


def _tag_category(image_path: str, category_group: str, categories_data: Dict) -> str:
    """Tag the specific category within a category group."""
    categories = categories_data["categoryGroups"][category_group]["categories"]
    sub_category_name_formatted = tag_category(category_group, categories, image_path)
    sub_category_name = _extract_category_value(sub_category_name_formatted)
    return sub_category_name


def _tag_specific_attributes(image_path: str, category_group: str, specific_attributes_data: Dict) -> Dict[str, str]:
    """Tag specific attributes for the given category group."""
    specific_attributes = {}
    
    if category_group not in specific_attributes_data:
        return specific_attributes
    
    for attribute in specific_attributes_data[category_group]:
        attribute_options = specific_attributes_data[category_group][attribute]
        # Skip attributes with empty lists
        if not attribute_options or len(attribute_options) == 0:
            continue
        attribute_value_formatted = tag_category(
            attribute,
            attribute_options,
            image_path
        )
        attribute_value = _extract_category_value(attribute_value_formatted)
        specific_attributes[attribute] = attribute_value
    
    return specific_attributes


def _tag_generic_attributes(image_path: str, generic_attributes_data: Dict) -> Dict[str, str]:
    """Tag generic attributes (color, season, material, etc.)."""
    generic_attributes = {}
    
    for attribute in generic_attributes_data:
        attribute_options = generic_attributes_data[attribute]
        # Skip attributes with empty lists
        if not attribute_options or len(attribute_options) == 0:
            continue
        attribute_value_formatted = tag_category(
            attribute,
            attribute_options,
            image_path
        )
        attribute_value = _extract_category_value(attribute_value_formatted)
        generic_attributes[attribute] = attribute_value
    
    return generic_attributes


def tag_image(image_path: str, tags_dir: str = "tags") -> Dict[str, any]:
    """
    Tag an image with all categories and attributes.
    
    Args:
        image_path: Path to the image file to tag.
        tags_dir: Directory containing tag configuration files.
    
    Returns:
        Flattened dictionary with categoryGroup, category, and all attributes.
    """
    # Load tag configs
    configs = _load_tag_configs(tags_dir)
    categories_data = configs["categories"]
    specific_attributes_data = configs["specific_attributes"]
    generic_attributes_data = configs["generic_attributes"]
    
    # Tag category group
    category_group = _tag_category_group(image_path, categories_data)
    
    # Tag specific category
    category = _tag_category(image_path, category_group, categories_data)
    
    # Tag specific attributes
    specific_attributes = _tag_specific_attributes(image_path, category_group, specific_attributes_data)
    
    # Tag generic attributes
    generic_attributes = _tag_generic_attributes(image_path, generic_attributes_data)
    
    # Build flattened result dictionary
    result = {
        "categoryGroup": category_group,
        "category": category
    }
    
    # Add all specific attributes directly to result
    result.update(specific_attributes)
    
    # Add all generic attributes directly to result
    result.update(generic_attributes)
    
    return result
