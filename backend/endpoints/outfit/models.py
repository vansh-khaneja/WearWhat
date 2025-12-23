from pydantic import BaseModel
from typing import List, Optional

class Outfit(BaseModel):
    """Model for an outfit"""
    outfit_id: str  
    wardrobe_id: str
    image_url: str
    tags: dict

class UploadOutfitRequest(BaseModel):
    """Request model for uploading an outfit"""
    wardrobe_id: str

class UploadOutfitResponse(BaseModel):
    """Response model for uploading an outfit"""
    outfit_id: str
    result: bool
    message: str = "Outfit uploaded successfully"

class GetOutfitsResponse(BaseModel):
    """Response model for getting outfits"""
    outfits: List[Outfit]

class GetOutfitsRequest(BaseModel):
    """Request model for getting outfits"""
    wardrobe_id: str

class DeleteOutfitRequest(BaseModel):
    """Request model for deleting an outfit"""
    outfit_id: str

class DeleteOutfitResponse(BaseModel):
    """Response model for deleting an outfit"""
    result: bool
    message: str = "Outfit deleted successfully"

class UpdateOutfitRequest(BaseModel):
    """Request model for updating an outfit"""
    outfit_id: str
    tags: dict

class UpdateOutfitResponse(BaseModel):
    """Response model for updating an outfit"""
    result: bool
    message: str = "Outfit updated successfully"

class SuggestOutfitRequest(BaseModel):
    """Request model for suggesting outfits"""
    wardrobe_id: str
    temperature: Optional[float] = None
    query: Optional[str] = None

class SuggestOutfitResponse(BaseModel):
    """Response model for suggesting outfits"""
    outfits: List[Outfit]
    composite_image_url: Optional[str] = None
    result: bool
    message: str = "Outfits suggested successfully"

class WeeklyOutfitDay(BaseModel):
    """Model for a day's outfit in weekly planning"""
    day: str  # Monday, Tuesday, etc.
    outfit: Outfit
    composite_image_url: Optional[str] = None

class PlanWeekRequest(BaseModel):
    """Request model for weekly planning"""
    wardrobe_id: str
    temperature: Optional[float] = None

class PlanWeekResponse(BaseModel):
    """Response model for weekly planning"""
    weekly_outfits: List[WeeklyOutfitDay]
    result: bool
    message: str = "Weekly plan generated successfully"