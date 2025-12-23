"""
Upload Outfit Routes
FastAPI routes for uploading outfit images.
"""

import os
import tempfile
from fastapi import APIRouter, HTTPException, status, File, UploadFile, Form
from endpoints.outfit.models import UploadOutfitResponse, GetOutfitsResponse, GetOutfitsRequest, DeleteOutfitResponse, UpdateOutfitResponse, UpdateOutfitRequest, SuggestOutfitRequest, SuggestOutfitResponse, PlanWeekRequest, PlanWeekResponse, WeeklyOutfitDay, Outfit
from image_tagging import tag_image
from mongodb_uploader import upload_item, get_items, delete_item, update_item   
from uuid import uuid4
from cloudinary_uploader import upload_image
from image_composer import create_composite_image

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


@router.put("/update-outfit", response_model=UpdateOutfitResponse, status_code=status.HTTP_200_OK)
async def update_outfit_endpoint(request: UpdateOutfitRequest):
    """
    Update an outfit.
    
    Args:
        request: UpdateOutfitRequest containing outfit_id and tags.
    """
    response = update_item(request.outfit_id, {"tags": request.tags})
    return UpdateOutfitResponse(result=True, message="Outfit updated successfully")


@router.post("/suggest-outfit", response_model=SuggestOutfitResponse, status_code=status.HTTP_200_OK)
async def suggest_outfit_endpoint(request: SuggestOutfitRequest):
    """
    Suggest outfits based on wardrobe.
    
    Args:
        request: SuggestOutfitRequest containing wardrobe_id, optional temperature and query.
    
    Returns:
        SuggestOutfitResponse with 3-5 suggested outfits and a composite image.
    """
    # Get all outfits from wardrobe
    items = get_items(request.wardrobe_id)
    
    # Map MongoDB documents to Outfit model format
    all_outfits = []
    for item in items:
        outfit = {
            "outfit_id": item.get("item_id", ""),
            "wardrobe_id": item.get("wardrobe_id", ""),
            "image_url": item.get("image_url", ""),
            "tags": item.get("tags", {})
        }
        all_outfits.append(outfit)
    
    # For now, randomly select 3-5 outfits (or all if less than 3)
    import random
    if len(all_outfits) <= 3:
        selected_outfits = all_outfits
    else:
        # Select 3-5 random outfits
        num_to_select = min(random.randint(3, 5), len(all_outfits))
        selected_outfits = random.sample(all_outfits, num_to_select)
    
    # Generate composite image
    composite_image_url = None
    if selected_outfits:
        try:
            # Extract image URLs
            image_urls = [outfit["image_url"] for outfit in selected_outfits if outfit.get("image_url")]
            
            if image_urls:
                # Create composite image
                composite_image = create_composite_image(image_urls, layout="grid")
                
                # Save to temporary file
                temp_file_path = None
                try:
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                        temp_file_path = temp_file.name
                        composite_image.save(temp_file_path, 'JPEG', quality=95)
                    
                    # Upload composite image to Cloudinary
                    composite_image_url, _ = upload_image(temp_file_path)
                finally:
                    # Clean up temporary file
                    if temp_file_path and os.path.exists(temp_file_path):
                        try:
                            os.remove(temp_file_path)
                        except Exception:
                            pass
        except Exception as e:
            # Log error but don't fail the request
            print(f"Warning: Failed to create composite image: {str(e)}")
            composite_image_url = None
    
    return SuggestOutfitResponse(
        outfits=selected_outfits,
        composite_image_url=composite_image_url,
        result=True,
        message="Outfits suggested successfully"
    )


@router.post("/plan-week", response_model=PlanWeekResponse, status_code=status.HTTP_200_OK)
async def plan_week_endpoint(request: PlanWeekRequest):
    """
    Generate weekly outfit plan (Monday to Sunday).
    
    Args:
        request: PlanWeekRequest containing wardrobe_id and optional temperature.
    
    Returns:
        PlanWeekResponse with outfits for each day of the week.
    """
    days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    weekly_outfits = []
    
    # Get all outfits from wardrobe
    items = get_items(request.wardrobe_id)
    
    # Map MongoDB documents to Outfit model format
    all_outfits = []
    for item in items:
        outfit = {
            "outfit_id": item.get("item_id", ""),
            "wardrobe_id": item.get("wardrobe_id", ""),
            "image_url": item.get("image_url", ""),
            "tags": item.get("tags", {})
        }
        all_outfits.append(outfit)
    
    if not all_outfits:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No outfits found in wardrobe. Please add some outfits first."
        )
    
    # Generate outfit for each day
    import random
    for day in days_of_week:
        # Select a random outfit for this day
        selected_outfit_dict = random.choice(all_outfits)
        selected_outfit = Outfit(**selected_outfit_dict)
        
        # Use the outfit's image URL directly (no need for composite for single outfit)
        weekly_outfits.append(WeeklyOutfitDay(
            day=day,
            outfit=selected_outfit,
            composite_image_url=selected_outfit.image_url
        ))
    
    return PlanWeekResponse(
        weekly_outfits=weekly_outfits,
        result=True,
        message="Weekly plan generated successfully"
    )