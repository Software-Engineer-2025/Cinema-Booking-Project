from fastapi import APIRouter, Depends
from.security import get_current_user

router = APIRouter()

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return current_user
