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
    condition: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class WeatherData(BaseModel):
    """Weather data model"""
    temp_c: Optional[float] = None
    temp_f: Optional[float] = None
    condition_text: Optional[str] = None
    condition_icon: Optional[str] = None
    region: Optional[str] = None
    country: Optional[str] = None
    last_updated: Optional[str] = None

class SuggestOutfitResponse(BaseModel):
    """Response model for suggesting outfits"""
    outfits: List[Outfit]
    composite_image_url: Optional[str] = None
    weather: Optional[WeatherData] = None
    result: bool
    message: str = "Outfits suggested successfully"