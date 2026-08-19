from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.core.database import get_db
from app.schemas.auth import RegisterRequest, Token
from app.services import auth_service

# 🚨 New imports needed for the /me endpoint
from app.models.user import User
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=Token)
def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    user = auth_service.register_user(db, payload)
    return {
        "access_token": auth_service.issue_token(user),
        "token_type": "bearer"
    }

@router.post("/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # OAuth2PasswordRequestForm uses 'username' for the email field in the background
    user = auth_service.authenticate_user(db, form_data.username, form_data.password)
    return {
        "access_token": auth_service.issue_token(user),
        "token_type": "bearer"
    }

# 🚨 The missing endpoint React is looking for!
@router.get("/me")
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """
    Returns the currently logged-in user's data.
    React uses this to keep the user logged in upon page refresh.
    """
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "xp": getattr(current_user, "xp", 0)
    }