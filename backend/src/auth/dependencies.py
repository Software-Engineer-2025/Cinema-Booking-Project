from typing import Optional
import os
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt, JWTError
import httpx
from jose.backends.base import Key
from typing import Dict, Optional
import json

security = HTTPBearer()

class JWKSClient:
    def __init__(self, jwks_url: str):
        self.jwks_url = jwks_url
        self._cached_keys: Dict[str, Key] = {}

    async def get_signing_key(self, kid: str) -> Optional[Dict]:
        if not self._cached_keys:
            await self.refresh_keys()
        
        return self._cached_keys.get(kid)

    async def refresh_keys(self):
        async with httpx.AsyncClient() as client:
            response = await client.get(self.jwks_url)
            response.raise_for_status()
            keys = response.json()
            self._cached_keys = {key["kid"]: key for key in keys["keys"]}

jwks_client = JWKSClient(os.getenv("SUPABASE_JWKS_URL"))

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        # First decode without verification to get the key id (kid)
        unverified_header = jwt.get_unverified_header(token)
        kid = unverified_header.get("kid")
        
        if not kid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token header"
            )

        # Get the signing key from JWKS
        signing_key = await jwks_client.get_signing_key(kid)
        if not signing_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Unable to find appropriate key"
            )

        # Verify the token
        payload = jwt.decode(
            token,
            signing_key,
            algorithms=[os.getenv("JWT_ALGORITHM", "ES256")],
            options={"verify_aud": False}  # Supabase tokens don't include aud claim
        )
        
        return payload
        
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Error validating token: {str(e)}"
        )