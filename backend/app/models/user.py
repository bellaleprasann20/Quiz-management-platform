from sqlalchemy import Column, Integer, String, Boolean, DateTime, Enum, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func  # <-- Imported for database-level timestamps
import enum

from app.core.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    STUDENT = "student"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, index=True) # React form uses 'name', mapped to this
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    
    # PostgreSQL handles this beautifully by creating a native ENUM data type
    role = Column(Enum(UserRole), default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)
    
    # --- PROFILE FIELDS ---
    phone = Column(String, nullable=True)
    location = Column(String, nullable=True)
    title = Column(String, nullable=True)
    bio = Column(Text, nullable=True) 
    # ----------------------
    
    # Anti-cheat lockout field
    interview_ban_until = Column(DateTime(timezone=True), nullable=True)
    
    # THE FIX: Database-level timestamps for Render
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    attempts = relationship("Attempt", back_populates="user", cascade="all, delete-orphan")
    
    # === NEW: The missing link for the "Ghost Quiz" fix! ===
    quizzes = relationship("Quiz", back_populates="creator")