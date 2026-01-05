from fastapi import Cookie, HTTPException, status
import jwt
from auth.cookie_utils import SECRET_KEY
from auth.user_db import get_user_by_id


def require_user(auth_token: str | None = Cookie(default=None)):
    if not auth_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="No auth cookie")
    try:
        decoded = jwt.decode(auth_token, SECRET_KEY, algorithms=["HS256"])
        user_id = str(decoded.get("user_id"))
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    user = get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    uid, username, email = user
    return {"user_id": uid, "username": username, "email": email}
