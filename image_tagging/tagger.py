"""
Image Tagger Module
Handles the complete tagging workflow for fashion images.
"""

import json
from typing import Dict
from pathlib import Path

from image_tagging.classifier import tag_category


class ImageTagger:
    """Main class for tagging fashion images with categories and attributes."""
    
    def __init__(self, tags_dir: str = "tags"):
        """Initialize with tag configuration files."""
        self.tags_dir = Path(tags_dir)
        self._load_tag_configs()
    
    def _load_tag_configs(self):
        """Load all tag configuration files."""
        # Load categories
        with open(self.tags_dir / "categories.json", "r") as f:
            self.categories_data = json.load(f)
        
        # Load specific attributes
        with open(self.tags_dir / "specific_attributes.json", "r") as f:
            self.specific_attributes_data = json.load(f)
        
        # Load generic attributes
        with open(self.tags_dir / "generic_attributes.json", "r") as f:
            self.generic_attributes_data = json.load(f)
    
    def _extract_category_value(self, formatted_label: str) -> str:
        """Extract category value from formatted label (e.g., 'outfit with Category as upperWear' -> 'upperWear')."""
        if " as " in formatted_label:
            return formatted_label.split(" as ")[-1]
        return formatted_label
    
    def _tag_category_group(self, image_path: str) -> str:
        """Tag the category group (e.g., upperWear, bottomWear)."""
        category_keys = list(self.categories_data["categoryGroups"].keys())
        category_name_formatted = tag_category("Category", category_keys, image_path)
        category_name = self._extract_category_value(category_name_formatted)
        return category_name
    
    def _tag_category(self, image_path: str, category_group: str) -> str:
        """Tag the specific category within a category group."""
        categories = self.categories_data["categoryGroups"][category_group]["categories"]
        sub_category_name_formatted = tag_category(category_group, categories, image_path)
        sub_category_name = self._extract_category_value(sub_category_name_formatted)
        return sub_category_name
    
    def _tag_specific_attributes(self, image_path: str, category_group: str) -> Dict[str, str]:
        """Tag specific attributes for the given category group."""
        specific_attributes = {}
        
        if category_group not in self.specific_attributes_data:
            return specific_attributes
        
        for attribute in self.specific_attributes_data[category_group]:
            attribute_options = self.specific_attributes_data[category_group][attribute]
            # Skip attributes with empty lists
            if not attribute_options or len(attribute_options) == 0:
                continue
            attribute_value_formatted = tag_category(
                attribute,
                attribute_options,
                image_path
            )
            attribute_value = self._extract_category_value(attribute_value_formatted)
            specific_attributes[attribute] = attribute_value
        
        return specific_attributes
    
    def _tag_generic_attributes(self, image_path: str) -> Dict[str, str]:
        """Tag generic attributes (color, season, material, etc.)."""
        generic_attributes = {}
        
        for attribute in self.generic_attributes_data:
            attribute_options = self.generic_attributes_data[attribute]
            # Skip attributes with empty lists
            if not attribute_options or len(attribute_options) == 0:
                continue
            attribute_value_formatted = tag_category(
                attribute,
                attribute_options,
                image_path
            )
            attribute_value = self._extract_category_value(attribute_value_formatted)
            generic_attributes[attribute] = attribute_value
        
        return generic_attributes
    
    def tag_image(self, image_path: str) -> Dict[str, any]:
        """Tag an image with all categories and attributes. Returns flattened dictionary with categoryGroup, category, and all attributes."""
        # Tag category group
        category_group = self._tag_category_group(image_path)
        
        # Tag specific category
        category = self._tag_category(image_path, category_group)
        
        # Tag specific attributes
        specific_attributes = self._tag_specific_attributes(image_path, category_group)
        
        # Tag generic attributes
        generic_attributes = self._tag_generic_attributes(image_path)
        
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


def tag_image(image_path: str, tags_dir: str = "tags") -> Dict[str, any]:
    """Convenience function to tag an image."""
    tagger = ImageTagger(tags_dir=tags_dir)
    return tagger.tag_image(image_path)

