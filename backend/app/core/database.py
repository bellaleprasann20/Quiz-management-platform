from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Check if the database URL is for SQLite; if so, add the specific argument.
# Otherwise, connect normally for PostgreSQL.
if settings.SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(settings.SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency generator to provide a database session to our routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()