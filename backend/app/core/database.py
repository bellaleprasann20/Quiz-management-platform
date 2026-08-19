from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# connect_args={"check_same_thread": False} is required for SQLite in FastAPI
engine = create_engine(
    settings.SQLALCHEMY_DATABASE_URL, 
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency generator to provide a database session to our routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()