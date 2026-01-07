"""
MongoDB Uploader Module
Handles uploading, retrieving, and deleting documents in MongoDB.
"""

import os
from typing import Dict, Optional, Any, List

from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

# MongoDB connection setup
mongodb_client = MongoClient(os.getenv("MONGODB_URI"))
DB_NAME = "WearWhat"
OUTFITS_COLLECTION_NAME = "outfits"
WEEKLY_PLANS_COLLECTION_NAME = "weekly_plans"

database: Database = mongodb_client[DB_NAME]

# Create collections if they don't exist
if OUTFITS_COLLECTION_NAME not in database.list_collection_names():
    database.create_collection(OUTFITS_COLLECTION_NAME)

if WEEKLY_PLANS_COLLECTION_NAME not in database.list_collection_names():
    database.create_collection(WEEKLY_PLANS_COLLECTION_NAME)

outfits_collection: Collection = database[OUTFITS_COLLECTION_NAME]
weekly_plans_collection: Collection = database[WEEKLY_PLANS_COLLECTION_NAME]



def upload_item(outfit: Dict[str, Any]) -> str:
    """
    Upload a document to MongoDB.
    
    Args:
        outfit: Dictionary containing the outfit data to upload.
    
    Returns:
        The inserted document ID as a string.
    """
    result = outfits_collection.insert_one(outfit)
    return str(result.inserted_id)


def get_item(item_id: str) -> str:
    """
    Retrieve a document from MongoDB by ID.
    
    Args:
        outfit_id: The ID of the document to retrieve (can be string or ObjectId).
    
    Returns:
        The document dictionary if found, None otherwise.
    """

    result = outfits_collection.find_one({"item_id": item_id})
    return result


def delete_item(item_id: str) -> int:
    """
    Delete a document from MongoDB by ID.
    
    Args:
        item_id: The ID of the document to delete.
    
    Returns:
        The number of documents deleted (0 or 1).
    """
    result = outfits_collection.delete_one({"item_id": item_id})
    return result.deleted_count


def get_items(wardrobe_id: str) -> List[Dict[str, Any]]:
    """
    Retrieve all documents from MongoDB by wardrobe ID.
    
    Args:
        wardrobe_id: The ID of the wardrobe to retrieve documents from.
    
    Returns:
        List of documents if found, empty list otherwise.
    """
    result = outfits_collection.find({"wardrobe_id": wardrobe_id})
    return list(result)

def delete_items(wardrobe_id: str) -> int:
    """
    Delete all documents from MongoDB by wardrobe ID.
    
    Args:
        wardrobe_id: The ID of the wardrobe to delete documents from.
    
    Returns:
        The number of documents deleted (0 or 1).
    """
    result = outfits_collection.delete_many({"wardrobe_id": wardrobe_id})
    return result.deleted_count


def update_item(item_id: str, item: Dict[str, Any]) -> int:
    """
    Update a document in MongoDB by ID.

    Args:
        item_id: The ID of the document to update.
        item: The document to update.

    Returns:
        The number of documents updated (0 or 1).
    """
    result = outfits_collection.update_one({"item_id": item_id}, {"$set": item})
    return result.modified_count


# Weekly Plans Functions

def upload_weekly_plan(weekly_plan: Dict[str, Any]) -> str:
    """
    Upload a weekly plan document to MongoDB.
    Only one weekly plan per wardrobe - deletes existing plan if it exists.

    Args:
        weekly_plan: Dictionary containing the weekly plan data to upload.

    Returns:
        The inserted document ID as a string.
    """
    wardrobe_id = weekly_plan.get("wardrobe_id")

    # Delete existing weekly plan for this wardrobe
    weekly_plans_collection.delete_many({"wardrobe_id": wardrobe_id})

    # Insert the new weekly plan
    result = weekly_plans_collection.insert_one(weekly_plan)
    return str(result.inserted_id)


def get_weekly_plan(wardrobe_id: str) -> Optional[Dict[str, Any]]:
    """
    Retrieve the weekly plan for a wardrobe ID.
    Note: There is only one weekly plan per wardrobe.

    Args:
        wardrobe_id: The ID of the wardrobe to retrieve the weekly plan from.

    Returns:
        The weekly plan document if found, None otherwise.
    """
    result = weekly_plans_collection.find_one({"wardrobe_id": wardrobe_id})
    return result