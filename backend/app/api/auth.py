from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.auth import RegisterRequest, Token
from app.services import auth_service
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=Token)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    """
    Registers a new user and immediately issues an access token.
    """
    user = auth_service.register_user(db, payload)
    
    return {
        "access_token": auth_service.issue_token(user),
        "token_type": "bearer"
    }


@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    """
    Authenticates a user and returns a JWT token.
    Note: OAuth2PasswordRequestForm expects the email to be sent in the 'username' field.
    """
    user = auth_service.authenticate_user(db, form_data.username, form_data.password)
    
    return {
        "access_token": auth_service.issue_token(user),
        "token_type": "bearer"
    }


@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Returns the currently logged-in user's data.
    React uses this endpoint to maintain the user's session upon page refresh.
    """
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        # Safely fetches XP if the column exists, otherwise defaults to 0
        "xp": getattr(current_user, "xp", 0) 
    }