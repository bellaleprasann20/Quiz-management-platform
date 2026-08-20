import os

class Settings:
    PROJECT_NAME: str = "Quiz Management Platform"
    
    # 1. Fetch the raw URL from Render (or use SQLite if testing locally)
    raw_db_url = os.getenv("DATABASE_URL", "sqlite:///./quiz.db")
    
    # 2. THE FIX: SQLAlchemy requires 'postgresql://', but Render provides 'postgres://'
    if raw_db_url.startswith("postgres://"):
        SQLALCHEMY_DATABASE_URL = raw_db_url.replace("postgres://", "postgresql://", 1)
    else:
        SQLALCHEMY_DATABASE_URL = raw_db_url
        
    # Security Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-later")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

settings = Settings()