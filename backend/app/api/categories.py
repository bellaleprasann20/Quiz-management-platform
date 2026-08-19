from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.category import Category

router = APIRouter(prefix="/categories", tags=["categories"])

@router.get("/")
def get_all_categories(
    search: Optional[str] = Query(None),  # Changed 'q' to 'search'
    db: Session = Depends(get_db)
):
    # 1. Start the database query
    base_query = db.query(Category)
    
    # 2. If 'search' was provided, filter the results!
    if search:
        # .ilike() makes it case-insensitive.
        base_query = base_query.filter(Category.name.ilike(f"%{search}%"))
        
    # 3. Finally, fetch and return the results
    return base_query.all()

@router.get("/{category_id}")
def get_category(category_id: int, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    return category