import os

class Settings:
    PROJECT_NAME: str = "Quiz Management Platform"
    
    # Database Settings
    # Defaults to SQLite, but can easily be swapped to PostgreSQL later via .env
    SQLALCHEMY_DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./quiz.db")
    
    # Security Settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-super-secret-key-change-this-later")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

settings = Settings()