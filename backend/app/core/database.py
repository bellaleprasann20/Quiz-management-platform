from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

# Check if the database URL is for SQLite; if so, add the specific argument.
# Otherwise, connect normally for PostgreSQL with production safeguards.
if settings.SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URL, 
        connect_args={"check_same_thread": False}
    )
else:
    # THE FIX: Added pool_pre_ping=True for stable cloud database connections
    engine = create_engine(
        settings.SQLALCHEMY_DATABASE_URL,
        pool_pre_ping=True,  # Prevents crashes from dropped connections
        pool_size=5,         # Standard pool size for small/medium apps
        max_overflow=10      # Allows brief spikes in traffic
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