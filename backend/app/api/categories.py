from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.category import Category

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("/")
def get_all_categories(
    search: Optional[str] = Query(None, description="Search term to filter categories by name"),
    db: Session = Depends(get_db)
):
    """
    Fetches all categories. If a search term is provided, 
    it returns a case-insensitive filtered list.
    """
    # 1. Start the database query
    base_query = db.query(Category)
    
    # 2. If 'search' was provided, filter the results
    if search:
        # .ilike() ensures case-insensitive search for PostgreSQL compatibility
        base_query = base_query.filter(Category.name.ilike(f"%{search}%"))
        
    # 3. Finally, fetch and return the results
    return base_query.all()


@router.get("/{category_id}")
def get_category(category_id: int, db: Session = Depends(get_db)):
    """
    Fetches a single category by its ID.
    """
    category = db.query(Category).filter(Category.id == category_id).first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
        
    return category