from fastapi import APIRouter, Request, HTTPException
import os
import json
import urllib.request
import jwt

router = APIRouter()


@router.get("/debug-token")
def debug_token(request: Request):
    """Development endpoint: return token header and JWKS info.

    Usage: set Authorization: Bearer <token>
    Returns unverified JWT header and a small summary of the JWKS fetched from SUPABASE_JWKS_URL.
    """
    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        raise HTTPException(status_code=400, detail="Provide Authorization: Bearer <token>")
    token = auth.split(" ", 1)[1]

    try:
        header = jwt.get_unverified_header(token)
    except Exception as e:
        header = {"error": str(e)}

    jwks_url = os.getenv("SUPABASE_JWKS_URL", "http://127.0.0.1:54321/auth/v1/certs")
    try:
        with urllib.request.urlopen(jwks_url, timeout=5) as resp:
            jwks = json.load(resp)
    except Exception as e:
        # Attempt to load local signing_key.json as a fallback (useful for local dev)
        jwks = {"error": str(e), "url": jwks_url}
        try:
            # signing_key.json is located in the repo's supabase/ folder
            local_path = os.path.join(os.path.dirname(__file__), '..', '..', 'supabase', 'signing_key.json')
            with open(local_path, 'r') as f:
                local_keys = json.load(f)
            # Convert local signing_key.json (private keys array) into a JWKS-like dict with public fields
            keys = []
            for k in local_keys:
                # include public fields only
                public_k = {k2: k[k2] for k2 in ("kty", "kid", "use", "alg", "crv", "x", "y") if k2 in k}
                keys.append(public_k)
            jwks = {"keys": keys, "source": "local_signing_key"}
        except Exception as e2:
            jwks["local_error"] = str(e2)

    kid = header.get("kid") if isinstance(header, dict) else None
    kid_found = False
    sample_key = None
    if isinstance(jwks, dict) and jwks.get("keys") and kid:
        for k in jwks.get("keys", []):
            if k.get("kid") == kid:
                kid_found = True
                sample_key = k
                break
    elif isinstance(jwks, dict) and jwks.get("keys"):
        sample_key = jwks.get("keys")[0]

    return {
        "header": header,
        "jwks_url": jwks_url,
        "jwks_keys_count": len(jwks.get("keys", [])) if isinstance(jwks, dict) and jwks.get("keys") else None,
        "kid": kid,
        "kid_found": kid_found,
        "sample_key": sample_key,
    }
