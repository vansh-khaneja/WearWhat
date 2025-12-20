"""
Pydantic Models for Authentication
Request and response schemas for API endpoints.
"""

from pydantic import BaseModel
from typing import Optional



class SignUpRequest(BaseModel):
    """Request model for user signup"""
    username: str
    email: str
    password: str


class LoginRequest(BaseModel):
    """Request model for user login"""
    email: str
    password: str


class SignUpResponse(BaseModel):
    """Response model for user signup"""
    user_id: str
    message: str = "User created successfully"


class LoginResponse(BaseModel):
    """Response model for user login"""
    user_id: Optional[str] = None
    username: Optional[str] = None
    email: Optional[str] = None
    message: str = "Login successful"

