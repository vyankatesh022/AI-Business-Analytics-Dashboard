from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.security.jwt import verify_access_token

security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Extracts the Bearer token, verifies it, and returns the user payload.
    """
    token = credentials.credentials
    payload = verify_access_token(token)
    return payload

def require_role(allowed_roles: list[str]):
    """
    Dependency generator for Role-Based Access Control (RBAC).
    Checks if the current user has one of the allowed roles.
    """
    def role_checker(user: dict = Depends(get_current_user)):
        # Supabase injects app_metadata into the JWT token
        app_metadata = user.get("app_metadata", {})
        user_role = app_metadata.get("role", "Free")  # Default to Free
        
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this resource."
            )
        return user
    return role_checker
