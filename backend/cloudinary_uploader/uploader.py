"""
Cloudinary Uploader Module
Handles uploading and deleting images on Cloudinary.
"""

import os
from typing import Tuple, Dict

import cloudinary
import cloudinary.uploader
from dotenv import load_dotenv

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)


def upload_image(image_path: str) -> Tuple[str, str]:
    """
    Upload an image to Cloudinary.
    
    Args:
        image_path: Path to the image file to upload.
        
    Returns:
        Tuple containing (secure_url, public_id) of the uploaded image.
    """
    response = cloudinary.uploader.upload(image_path)
    return response['secure_url'], response['public_id']


def delete_image(public_id: str) -> Dict:
    """
    Delete an image from Cloudinary.
    
    Args:
        public_id: The public ID of the image to delete.
        
    Returns:
        Response dictionary from Cloudinary API.
    """
    response = cloudinary.uploader.destroy(public_id)
    return response
