from typing import Optional
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.user import User
from app.core.security import hash_password 
from app.dependencies.auth import get_current_user  

router = APIRouter(prefix="/users", tags=["users"])

# --- Schemas ---
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserProfileUpdate(BaseModel):
    name: Optional[str] = None  
    phone: Optional[str] = None
    location: Optional[str] = None
    title: Optional[str] = None
    bio: Optional[str] = None
    password: Optional[str] = None

# --- Endpoints ---
@router.get("/")
def get_all_users(db: Session = Depends(get_db)):
    """
    Fetches all users for the Admin dashboard.
    We manually format the dictionary to ensure passwords are NEVER sent to the frontend.
    """
    users = db.query(User).all()
    
    return [
        {
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role.value if hasattr(u.role, 'value') else u.role,
            "is_active": u.is_active
        } for u in users
    ]


@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    """
    Creates a new user account (defaults to STUDENT role).
    """
    # 1. Check if the email is already in use
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    try:
        # 2. Create the new user
        new_user = User(
            username=user.username,
            email=user.email,
            hashed_password=hash_password(user.password),
            role="STUDENT",  # Public registration always creates students
            is_active=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return {
            "message": "User registered successfully!",
            "user": {
                "id": new_user.id,
                "username": new_user.username,
                "email": new_user.email,
                "role": new_user.role.value if hasattr(new_user.role, 'value') else new_user.role
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/profile")
def update_profile(
    payload: UserProfileUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    """
    Updates the logged-in user's profile information.
    """
    db_user = db.query(User).filter(User.id == current_user.id).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
        
    # Update standard fields if they were provided
    if payload.name is not None:
        db_user.username = payload.name  
    if payload.phone is not None:
        db_user.phone = payload.phone
    if payload.location is not None:
        db_user.location = payload.location
    if payload.title is not None:
        db_user.title = payload.title
    if payload.bio is not None:
        db_user.bio = payload.bio
        
    # Update password ONLY if the user typed a new one
    if payload.password:
        db_user.hashed_password = hash_password(payload.password)
        
    try:
        db.commit()
        db.refresh(db_user)
        return {
            "message": "Profile updated successfully!",
            "user": {
                "id": db_user.id,
                "username": db_user.username,
                "phone": db_user.phone,
                "location": db_user.location,
                "title": db_user.title,
                "bio": db_user.bio
            }
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))