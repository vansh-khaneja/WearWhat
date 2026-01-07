"""
MongoDB Uploader Package
A modular package for uploading and managing documents in MongoDB.
"""

from mongodb_uploader.uploader import upload_item, get_item, delete_item, get_items, delete_items, update_item, get_weekly_plan, upload_weekly_plan

__all__ = ['upload_item', 'get_item', 'delete_item', 'get_items', 'delete_items', 'update_item', 'get_weekly_plan', 'upload_weekly_plan']

