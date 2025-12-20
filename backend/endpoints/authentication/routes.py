"""
Authentication Routes
FastAPI routes for login and signup.
"""

from fastapi import APIRouter, HTTPException, status
from endpoints.authentication.models import SignUpRequest, LoginRequest, SignUpResponse, LoginResponse
from auth.user_db import login, sign_up

router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=SignUpResponse, status_code=status.HTTP_201_CREATED)
async def signup_endpoint(request: SignUpRequest):
    """
    Sign up a new user.
    
    Args:
        request: SignUpRequest containing username, email, and password.
    
    Returns:
        SignUpResponse with user_id and success message.
    
    Raises:
        HTTPException: If email already exists or validation fails.
    """
    try:
        auth_data = {
            "username": request.username,
            "email": request.email,
            "password": request.password
        }
        user_id = sign_up(auth_data)
        return SignUpResponse(user_id=user_id)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during signup: {str(e)}"
        )


@router.post("/login", response_model=LoginResponse)
async def login_endpoint(request: LoginRequest):
    """
    Login a user.
    
    Args:
        request: LoginRequest containing email and password.
    
    Returns:
        LoginResponse with user_id and success message.
    
    Raises:
        HTTPException: If credentials are invalid.
    """
    auth_data = {
        "email": request.email,
        "password": request.password
    }
    
    user_id, username, email = login(auth_data)
    
    if not user_id or not username or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    return LoginResponse(user_id=user_id, username=username, email=email)

