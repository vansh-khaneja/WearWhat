"""
Password Utilities
Handles password hashing and verification using bcrypt.
"""

import bcrypt


def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt.
    
    Args:
        password: Plain text password to hash.
    
    Returns:
        Hashed password as a string.
    """
    hashed_bytes = bcrypt.hashpw(
        password.encode("utf-8"),
        bcrypt.gensalt(rounds=12)
    )
    return hashed_bytes.decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    """
    Verify a password against its hash.
    
    Args:
        password: Plain text password to verify.
        password_hash: Hashed password to compare against.
    
    Returns:
        True if password matches, False otherwise.
    """
    return bcrypt.checkpw(
        password.encode("utf-8"),
        password_hash.encode("utf-8")
    )

