from pydantic import BaseModel
from typing import List

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