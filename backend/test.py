import jwt
from datetime import datetime, timedelta, timezone

SECRET_KEY = "very_secret_key"

def issue_token(user_id: int):
    payload = {
        "user_id": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


def verify_cookie(token: str):
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return f"Authenticated user {decoded['user_id']}"
    except jwt.ExpiredSignatureError:
        return "❌ Token expired"



token = issue_token(101)
print("Token sent to browser as cookie:\n", token)

result = verify_cookie(token)
print("Server verification result:\n", result)
