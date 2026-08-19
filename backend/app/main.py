from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.core.database import engine, Base
from app.core.config import settings

# Forces Python to read our __init__.py and register all database tables
import app.models 

from app.api import (
    auth, users, categories, quizzes, questions, attempts, analytics, leaderboard
)

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API for the Quiz Management Platform",
    version="1.0.0"
)

# === ROBUST CORS SETUP FOR PUBLIC TESTING ===
# Option A: For open public testing where anyone can test from any frontend URL:
origins = ["*"]

# Option B: If you want stricter control, keep specific origins + environment variable:
# origins = [
#     "http://localhost:3000", 
#     "http://127.0.0.1:3000", 
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
# ]
# frontend_url = os.getenv("FRONTEND_URL")
# if frontend_url:
#     origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, # Using ["*"] ensures zero CORS blocking for public testers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
    return {"message": "API is online!"}