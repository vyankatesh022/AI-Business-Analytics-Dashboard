from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from backend.security.jwt import verify_access_token
import os
import json
from urllib.parse import unquote

security = HTTPBearer(auto_error=False)

def get_current_user(request: Request, credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Extracts the Bearer token, verifies it, and returns the user payload.
    Supports mock auth bypass in development.
    """
    # 1. Check for mock cookie in development
    if os.getenv("ENVIRONMENT", "development") == "development":
        mock_cookie = request.cookies.get("vibe_mock_auth")
        if mock_cookie:
            try:
                decoded_cookie = unquote(mock_cookie)
                payload = json.loads(decoded_cookie)
                if "user" in payload:
                    user_data = payload["user"]
                    if "app_metadata" not in user_data:
                        user_data["app_metadata"] = {"role": "Admin"}
                    return user_data
            except Exception as e:
                print(f"Mock auth cookie parse error: {e}")

    # 2. Otherwise expect Bearer token
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
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
