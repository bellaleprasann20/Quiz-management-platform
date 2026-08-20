import os
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine, Base, SessionLocal
from app.core.config import settings
import app.models 
from app.models.user import User

# 1. Create the database tables
Base.metadata.create_all(bind=engine)

# 2. THE IMMORTAL DATABASE HACK: Auto-seed if Render wiped the database
backend_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if backend_root not in sys.path:
    sys.path.append(backend_root)

try:
    db = SessionLocal()
    # Check if the Admin user exists. If not, the database is empty!
    if not db.query(User).first():
        print("⚠️ Render wiped the database! Auto-seeding now...")
        import seed
        seed.run_seed()
    db.close()
except Exception as e:
    print(f"Auto-seed error: {e}")

# 3. Start the application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for the Quiz Management Platform",
    version="1.0.0"
)

# === CLEAN CORS SETUP ===
origins = [
    "http://localhost:3000", 
    "http://127.0.0.1:3000", 
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://quiz-management-platform-lac.vercel.app"
]

frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from app.api import (
    auth, users, categories, quizzes, questions, attempts, analytics, leaderboard
)

app.include_router(auth.router, prefix="/api/v1")
app.include_router(users.router, prefix="/api/v1")
app.include_router(categories.router, prefix="/api/v1")
app.include_router(quizzes.router, prefix="/api/v1")
app.include_router(questions.router, prefix="/api/v1")
app.include_router(attempts.router, prefix="/api/v1")
app.include_router(analytics.router, prefix="/api/v1")
app.include_router(leaderboard.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "API is running"}

# === TEMPORARY FORCE-SEED ROUTE ===
@app.get("/api/v1/secret-seed-db")
def secret_seed():
    backend_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    if backend_root not in sys.path:
        sys.path.append(backend_root)
    
    import seed
    seed.run_seed()
    
    return {"message": "✅ BOOM! Fully seeded! 51 Quizzes loaded!"}