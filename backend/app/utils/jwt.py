from typing import Optional
from jose import jwt, JWTError

from app.core.config import settings

def decode_jwt_token(token: str) -> Optional[dict]:
    """
    Utility to decode a token manually (useful for background tasks or WebSockets).
    """
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        return payload
    except JWTError:
        return None