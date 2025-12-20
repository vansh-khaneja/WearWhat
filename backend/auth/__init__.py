"""
Authentication Package
Handles user authentication, signup, and login functionality.
"""

from auth.user_db import sign_up, login, delete_user

__all__ = ['sign_up', 'login', 'delete_user']
