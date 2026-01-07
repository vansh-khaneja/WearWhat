from pydantic import BaseModel
from typing import List, Optional, Dict

class Outfit(BaseModel):
    """Model for an outfit"""
    outfit_id: str  
    wardrobe_id: str
    image_url: str
    tags: dict

class UploadOutfitResponse(BaseModel):
    """Response model for uploading an outfit"""
    outfit_id: str
    result: bool
    message: str = "Outfit uploaded successfully"

class GetOutfitsResponse(BaseModel):
    """Response model for getting outfits"""
    outfits: List[Outfit]

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
    temperature: Optional[float] = None
    query: Optional[str] = None

class SuggestOutfitResponse(BaseModel):
    """Response model for suggesting outfits"""
    outfits: List[Outfit]
    composite_image_url: Optional[str] = None
    result: bool
    message: str = "Outfits suggested successfully"