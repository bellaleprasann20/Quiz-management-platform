from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.core.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STUDENT = "student"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True) # Note: React form uses 'name', we will map it to this!
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    role = Column(Enum(UserRole), default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)
    
    # --- NEW PROFILE FIELDS ---
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    title = Column(String, nullable=True)
    bio = Column(Text, nullable=True) 
    # --------------------------
    
    # Anti-cheat lockout field
    interview_ban_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    attempts = relationship("Attempt", back_populates="user", cascade="all, delete-orphan")