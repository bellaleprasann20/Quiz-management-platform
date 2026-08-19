import re

def is_strong_password(password: str) -> bool:
    """
    Validates password strength.
    Requires at least 8 characters, one uppercase letter, one lowercase letter, and one number.
    """
    if len(password) < 8:
        return False
    if not re.search(r"[A-Z]", password):
        return False
    if not re.search(r"[a-z]", password):
        return False
    if not re.search(r"\d", password):
        return False
    return True