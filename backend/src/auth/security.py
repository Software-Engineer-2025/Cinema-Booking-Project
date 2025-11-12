import os
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import jwt
from jwt import PyJWKClient
from dotenv import load_dotenv

load_dotenv()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/token")
jwks_client = PyJWKClient(os.getenv("SUPABASE_JWKS_URL", "http://127.0.0.1:54321/auth/v1/certs"))

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Verify Supabase JWT token and return user ID and token on success."""
    try:
        # Get the signing key from Supabase's JWKS endpoint
        signing_key = jwks_client.get_signing_key_from_jwt(token).key
        
        # Verify the token
        payload = jwt.decode(
            token, 
            signing_key, 
            algorithms=["ES256"],
            audience="authenticated"
        )
        
        # Extract and validate user ID
        user_id = payload.get("sub")
        if not user_id:
            raise jwt.PyJWTError("Missing user ID in token")
            
        return {"id": user_id}
        
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

def require_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """Verify that the current user is an admin."""
    from db.supabase import supabase_admin
    
    try:
        # Check if user is admin
        response = supabase_admin.table("userprofile").select("is_admin").eq("user_id", current_user["id"]).single().execute()
        
        if not response.data or not response.data.get("is_admin"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required"
            )
        
        return current_user
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error checking admin status: {str(e)}"
        )

