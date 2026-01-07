"""
User Database Operations
Handles user CRUD operations in MongoDB.
"""

import os
from typing import Dict, Any, Tuple
from datetime import datetime
from uuid import uuid4
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from dotenv import load_dotenv
from auth.password_utils import hash_password, verify_password

load_dotenv()

# MongoDB connection setup
mongodb_client = MongoClient(os.getenv("MONGODB_URI"))
DB_NAME = "WearWhat"
USERS_COLLECTION_NAME = "users"

database: Database = mongodb_client[DB_NAME]

# Create collection if it doesn't exist
if USERS_COLLECTION_NAME not in database.list_collection_names():
    database.create_collection(USERS_COLLECTION_NAME)

users_collection: Collection = database[USERS_COLLECTION_NAME]

# Drop unique index on username if it exists (usernames can be duplicate)
try:
    # Get all indexes and drop any unique index on username
    indexes = users_collection.list_indexes()
    for index in indexes:
        if "username" in index.get("key", {}):
            if index.get("unique"):
                users_collection.drop_index(index["name"])
except Exception:
    pass  # Index might not exist or already dropped

# Create unique indexes (only email and user_id should be unique)
try:
    users_collection.create_index("email", unique=True)
    users_collection.create_index("user_id", unique=True)
    # Create non-unique index on username for faster queries
    users_collection.create_index("username")
except Exception:
    pass  # Indexes might already exist


def sign_up(auth: Dict[str, Any]) -> str:
    """
    Sign up a new user with username, email and password.
    
    Args:
        auth: Dictionary containing 'username', 'email' and 'password' keys.
    
    Returns:
        The user_id as a string.
    
    Raises:
        ValueError: If email already exists or fields are missing
    """
    username = auth.get("username")
    email = auth.get("email")
    password = auth.get("password")
    
    if not username or not email or not password:
        raise ValueError("Username, email and password are required")
    
    # Check if user already exists
    existing_user = users_collection.find_one({"email": email})
    if existing_user:
        raise ValueError("User with this email already exists")
    
    # Generate unique user_id
    user_id = str(uuid4())
    password_hash = hash_password(password)
    # Create user document
    user_doc = {
        "user_id": user_id,
        "username": username,
        "email": email,
        "password": password_hash,
        "created_at": datetime.utcnow().isoformat(),
    }

    
    # Insert user into database
    users_collection.insert_one(user_doc)
    return user_id


def login(auth: Dict[str, Any]):
    """
    Login a user by verifying email and password.
    
    Args:
        auth: Dictionary containing 'email' and 'password' keys.
    
    Returns:
        The user_id, username and email as a tuple.
    """
    email = auth.get("email")
    password = auth.get("password")
    
    if not email or not password:
        raise ValueError("Email and password are required")
    
    # Find user by email
    user = users_collection.find_one({"email": email})
    
    if not user:
        raise ValueError("User not found")
    
    # Verify password (plain text comparison)
    if not verify_password(password, user.get("password")):
        raise ValueError("Invalid password")


    return user.get("user_id"), user.get("username"), user.get("email")


def delete_user(user_id: str) -> int:
    """
    Delete a user from MongoDB by user_id.
    
    Args:
        user_id: The user_id of the user to delete.
    
    Returns:
        The number of documents deleted (0 or 1).
    """
    result = users_collection.delete_one({"user_id": user_id})
    return result.deleted_count


def get_user_by_id(user_id: str):
    """
    Fetch a user by user_id.

    Args:
        user_id: The user_id of the user to fetch.

    Returns:
        Tuple of (user_id, username, email) if found, otherwise None.
    """
    user = users_collection.find_one({"user_id": user_id})
    if not user:
        return None
    return user.get("user_id"), user.get("username"), user.get("email")
