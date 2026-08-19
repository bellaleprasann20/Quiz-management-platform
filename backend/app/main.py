from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import engine, Base
from app.core.config import settings

# 🚨 This is the magic line! It forces Python to read our __init__.py 
# and register all database tables before any traffic hits the server.
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

# Added 127.0.0.1 variations to ensure React is never blocked
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://127.0.0.1:3000", 
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ], 
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