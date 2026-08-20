from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.user import User
from app.schemas.auth import RegisterRequest
from app.core.security import hash_password, verify_password, create_access_token

def register_user(db: Session, payload: RegisterRequest) -> User:
    # Check if the email is already in use
    existing_user = db.query(User).filter(User.email == payload.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create the new user
    new_user = User(
        username=payload.name,
        email=payload.email,
        hashed_password=hash_password(payload.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user


def authenticate_user(db: Session, email: str, password: str) -> User:
    user = db.query(User).filter(User.email == email).first()
    if not user or not verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


def issue_token(user: User) -> str:
    # Store the email as the subject ("sub") and include the role safely
    role_value = user.role.value if hasattr(user.role, 'value') else user.role
    token_data = {"sub": user.email, "role": role_value}
    return create_access_token(data=token_data)