from pydantic import BaseModel
from typing import List, Optional, Dict, Any


class ChatRequest(BaseModel):
    """Request model for outfit chat"""
    message: str
    temperature: Optional[float] = None
    context: Optional[Dict[str, Any]] = None


class ChatResponse(BaseModel):
    """Response model for outfit chat"""
    response: str
    image_urls: Optional[List[str]] = None
    result: bool
    message: str = "Chat response generated successfully"
