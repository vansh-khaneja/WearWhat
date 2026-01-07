import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")


def issue_token(user_id: str):
    # Default to 1 hour (3600 seconds) if not set
    session_timeout_seconds = int(os.getenv('SESSION_TIMEOUT_SECONDS', '3600'))
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(seconds=session_timeout_seconds)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def verify_cookie(token: str):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return f"Authenticated user {decoded['user_id']}"
    except jwt.ExpiredSignatureError:
        return "Token expired"