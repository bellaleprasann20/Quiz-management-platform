from fastapi import Depends, HTTPException, status
from app.models.user import User, UserRole
from app.dependencies.auth import get_current_user

def require_admin(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to ensure the current user is an Admin."""
    # Handle cases where the Enum might be stored as a string vs Enum object
    role_value = current_user.role.value if hasattr(current_user.role, 'value') else current_user.role
    
    if role_value != UserRole.ADMIN.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges. Admin access required."
        )
    return current_user

def require_student(current_user: User = Depends(get_current_user)) -> User:
    """Dependency to ensure the current user is a Student."""
    role_value = current_user.role.value if hasattr(current_user.role, 'value') else current_user.role
    
    if role_value != UserRole.STUDENT.value:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough privileges. Student access required."
        )
    return current_user