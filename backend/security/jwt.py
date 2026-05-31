import jwt
from fastapi import HTTPException, status
from backend.config.settings import settings

def verify_access_token(token: str) -> dict:
    """
    Verifies the Supabase JWT token and extracts the payload.
    Ensures that the token hasn't expired and hasn't been tampered with.
    """
    try:
        # Supabase uses HS256 to sign tokens using the SUPABASE_JWT_SECRET
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
            options={"verify_aud": True} 
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired. Please log in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials. Invalid token.",
            headers={"WWW-Authenticate": "Bearer"},
        )
