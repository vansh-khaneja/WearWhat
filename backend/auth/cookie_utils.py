import jwt
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv
import os
load_dotenv()
SECRET_KEY = os.getenv("SECRET_KEY")


def issue_token(user_id: str):
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(seconds=os.getenv('SESSION_TIMEOUT_SECONDS'))
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def verify_cookie(token: str):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return f"Authenticated user {decoded['user_id']}"
    except jwt.ExpiredSignatureError:
        return "Token expired"