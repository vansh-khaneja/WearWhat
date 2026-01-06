import os
import tempfile
from fastapi import APIRouter, HTTPException, status, File, UploadFile, Depends
from endpoints.outfit.models import UploadOutfitResponse, GetOutfitsResponse, GetOutfitsRequest, DeleteOutfitResponse, UpdateOutfitResponse, UpdateOutfitRequest, SuggestOutfitRequest, SuggestOutfitResponse, PlanWeekRequest, PlanWeekResponse, WeeklyOutfitDay, Outfit
from image_tagging import tag_image
from mongodb_uploader import upload_item, get_items, delete_item, update_item   
from uuid import uuid4
from cloudinary_uploader import upload_image
from image_composer import create_composite_image
from auth.deps import require_user

router = APIRouter(
    prefix="/outfit",
    tags=["outfit"],
    dependencies=[Depends(require_user)],
)


@router.post("/upload-outfit", response_model=UploadOutfitResponse, status_code=status.HTTP_201_CREATED)
async def upload_outfit_endpoint(
    file: UploadFile = File(...),
    user=Depends(require_user)
):
    
    temp_file_path = None
    try:
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File must be an image"
            )
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp_file:
            temp_file_path = temp_file.name
            content = await file.read()
            temp_file.write(content)
        
        tagged_dict = tag_image(temp_file_path)
        
        image_url, public_id = upload_image(temp_file_path)
        
        item_id = str(uuid4())
        
        document = {
            "wardrobe_id": user["user_id"],
            "item_id": item_id,
            "image_url": image_url,
            "tags": tagged_dict
        }
        
        upload_item(document)
        
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
        if temp_file_path and os.path.exists(temp_file_path):
            try:
                os.remove(temp_file_path)
            except Exception:
                pass




@router.get("/get-outfits", response_model=GetOutfitsResponse, status_code=status.HTTP_200_OK)
async def get_outfits_endpoint(user=Depends(require_user)):

    items = get_items(user["user_id"])
    outfits = []
    for item in items:

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

    response = delete_item(outfit_id)
    return DeleteOutfitResponse(result=True, message="Outfit deleted successfully")



@router.put("/update-outfit", response_model=UpdateOutfitResponse, status_code=status.HTTP_200_OK)
async def update_outfit_endpoint(request: UpdateOutfitRequest):
   
    response = update_item(request.outfit_id, {"tags": request.tags})
    return UpdateOutfitResponse(result=True, message="Outfit updated successfully")



@router.post("/suggest-outfit", response_model=SuggestOutfitResponse, status_code=status.HTTP_200_OK)
async def suggest_outfit_endpoint(request: SuggestOutfitRequest, user=Depends(require_user)):

    items = get_items(user["user_id"])  # ignore client-supplied wardrobe_id; use authenticated user_id
    
    all_outfits = []
    for item in items:
        outfit = {
            "outfit_id": item.get("item_id", ""),
            "wardrobe_id": item.get("wardrobe_id", ""),
            "image_url": item.get("image_url", ""),
            "tags": item.get("tags", {})
        }
        all_outfits.append(outfit)
    
    import random
    if len(all_outfits) <= 3:
        selected_outfits = all_outfits
    else:
        num_to_select = min(random.randint(3, 5), len(all_outfits))
        selected_outfits = random.sample(all_outfits, num_to_select)
    
    composite_image_url = None
    if selected_outfits:
        try:
            image_urls = [outfit["image_url"] for outfit in selected_outfits if outfit.get("image_url")]
            
            if image_urls:
                composite_image = create_composite_image(image_urls, layout="grid")
                
                temp_file_path = None
                try:
                    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as temp_file:
                        temp_file_path = temp_file.name
                        composite_image.save(temp_file_path, 'JPEG', quality=95)
                    
                    composite_image_url, _ = upload_image(temp_file_path)
                finally:
                    if temp_file_path and os.path.exists(temp_file_path):
                        try:
                            os.remove(temp_file_path)
                        except Exception:
                            pass
        except Exception as e:
            print(f"Warning: Failed to create composite image: {str(e)}")
            composite_image_url = None
    
    return SuggestOutfitResponse(
        outfits=selected_outfits,
        composite_image_url=composite_image_url,
        result=True,
        message="Outfits suggested successfully"
    )



@router.post("/plan-week", response_model=PlanWeekResponse, status_code=status.HTTP_200_OK)
async def plan_week_endpoint(request: PlanWeekRequest, user=Depends(require_user)):
   
    days_of_week = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    weekly_outfits = []
    
    items = get_items(user["user_id"]) 
    
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
    
    import random
    for day in days_of_week:
        selected_outfit_dict = random.choice(all_outfits)
        selected_outfit = Outfit(**selected_outfit_dict)
        
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