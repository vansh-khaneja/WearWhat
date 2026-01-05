"""
Authentication Routes
FastAPI routes for login and signup.
"""

from fastapi import APIRouter, HTTPException, status, Response, Depends
from endpoints.authentication.models import SignUpRequest, LoginRequest, SignUpResponse, LoginResponse
from auth.user_db import login, sign_up, get_user_by_id
from auth.cookie_utils import issue_token
from auth.deps import require_user

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
async def login_endpoint(request: LoginRequest, response: Response):
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

    # Issue JWT and set as HttpOnly cookie
    token = issue_token(user_id)
    # Dev defaults: samesite='lax', secure=False. Switch to 'none' + secure=True in production.
    response.set_cookie(
        key="auth_token",
        value=token,
        max_age=60,  # matches 1 minute token expiry
        httponly=True,
        samesite="lax",
        secure=False,
        path="/"
    )

    return LoginResponse(user_id=user_id, username=username, email=email)


@router.get("/session", response_model=LoginResponse)
async def session_endpoint(user=Depends(require_user)):
    """
    Return current user session using cookie (via dependency).
    """
    return LoginResponse(user_id=user["user_id"], username=user["username"], email=user["email"])


@router.post("/logout")
async def logout_endpoint(response: Response):
    """
    Clear auth cookie to log out the user.
    """
    response.delete_cookie(key="auth_token", path="/")
    return {"message": "Logged out"}

