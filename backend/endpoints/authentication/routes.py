from fastapi import APIRouter, HTTPException, status, Response, Depends
from endpoints.authentication.models import SignUpRequest, LoginRequest, SignUpResponse, LoginResponse
from auth.user_db import login, sign_up, get_user_by_id
from auth.cookie_utils import issue_token
from auth.deps import require_user
from dotenv import load_dotenv
import os 
load_dotenv()
router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/signup", response_model=SignUpResponse, status_code=status.HTTP_201_CREATED)
async def signup_endpoint(request: SignUpRequest):

    try:
        auth_data = {
            "username": request.username,
            "email": request.email,
            "password": request.password,
            "latitude": request.latitude,
            "longitude": request.longitude
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

    auth_data = {
        "email": request.email,
        "password": request.password,
        "latitude": request.latitude,
        "longitude": request.longitude
    }

    user_id, username, email = login(auth_data)
    
    if not user_id or not username or not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    token = issue_token(user_id)
    response.set_cookie(
        key="auth_token",
        value=token,
        max_age=int(os.getenv('SESSION_TIMEOUT_SECONDS', '3600')),
        httponly=True,
        samesite="lax",
        secure=False,
        path="/"
    )

    return LoginResponse(user_id=user_id, username=username, email=email)


@router.get("/session", response_model=LoginResponse)
async def session_endpoint(user=Depends(require_user)):

    return LoginResponse(user_id=user["user_id"], username=user["username"], email=user["email"])


@router.post("/logout")
async def logout_endpoint(response: Response):

    response.delete_cookie(key="auth_token", path="/")
    return {"message": "Logged out"}

