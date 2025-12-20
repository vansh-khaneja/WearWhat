"""
Upload Outfit Routes
FastAPI routes for uploading outfit images.
"""

import os
import tempfile
from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form
from endpoints.outfit.models import UploadOutfitResponse, GetOutfitsResponse, GetOutfitsRequest, DeleteOutfitResponse
from image_tagging import tag_image
from mongodb_uploader import upload_item, get_items, delete_item
from uuid import uuid4
from cloudinary_uploader import upload_image

router = APIRouter(prefix="/outfit", tags=["outfit"])


@router.post("/upload-outfit", response_model=UploadOutfitResponse, status_code=status.HTTP_201_CREATED)
async def upload_outfit_endpoint(
    file: UploadFile = File(...),
    wardrobe_id: str = Form(...)
):
    """
    Upload an outfit image.
    
    Args:
        file: The image file to upload.
        wardrobe_id: The ID of the wardrobe to add the outfit to.
    
    Returns:
        UploadOutfitResponse with outfit_id and success message.
    
    Raises:
        HTTPException: If upload or processing fails.
    """
    temp_file_path = None
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file_path = temp_file.name
            content = await file.read()
            temp_file.write(content)
        
        # Tag the image
        tagged_dict = tag_image(temp_file_path)
        
        # Upload image to Cloudinary
        image_url, public_id = upload_image(temp_file_path)
        
        # Generate unique item ID
        item_id = str(uuid4())
        
        # Create document for MongoDB
        document = {
            "wardrobe_id": wardrobe_id,
            "item_id": item_id,
            "image_url": image_url,
            "tags": tagged_dict
        }
        
        # Upload to MongoDB
        response = upload_item(document)
        
        return UploadOutfitResponse(
            outfit_id=item_id,
            result=True,
            message="Outfit uploaded successfully"
        )
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during upload: {str(e)}"
        )
    finally:
        # Clean up temporary file
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception:
                pass



@router.get("/get-outfits", response_model=GetOutfitsResponse, status_code=status.HTTP_200_OK)
async def get_outfits_endpoint(wardrobe_id: str):
    """
    Get all outfits for a wardrobe.
    
    Args:
        wardrobe_id: The ID of the wardrobe to get outfits from.
    
    Returns:
        GetOutfitsResponse with list of outfits.
    """
    items = get_items(wardrobe_id)
    # Map MongoDB documents to Outfit model format
    outfits = []
    for item in items:
        # Convert item_id to outfit_id and remove _id
        outfit = {
            "outfit_id": item.get("item_id", ""),
            "wardrobe_id": item.get("wardrobe_id", ""),
            "image_url": item.get("image_url", ""),
            "tags": item.get("tags", {})
        }
        outfits.append(outfit)
    return GetOutfitsResponse(outfits=outfits)

@router.delete("/delete-outfit", response_model=DeleteOutfitResponse, status_code=status.HTTP_200_OK)
async def delete_outfit_endpoint(outfit_id: str):
    """
    Delete an outfit.
    
    Args:
        outfit_id: The ID of the outfit to delete.
    """
    response = delete_item(outfit_id)
    return DeleteOutfitResponse(result=True, message="Outfit deleted successfully")