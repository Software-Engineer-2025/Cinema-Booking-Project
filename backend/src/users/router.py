from fastapi import APIRouter, HTTPException, Depends
from .schemas import UserProfileCreate, UserLogin, UserProfileUpdate, UserProfileResponse
from . import crud
from auth.security import get_current_user
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserProfileResponse)
def get_current_user_profile(current_user: dict = Depends(get_current_user)):
    """Return the calling user's profile.

    Uses the Supabase user id (sub claim) to query the `userprofile` table.
    """
    user_id = current_user["id"]
    profile = crud.get_profile_by_user_id(user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile


@router.put("/me", response_model=UserProfileResponse)
def update_current_user_profile(profile_update: UserProfileUpdate, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    update_data = profile_update.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No update data provided")
    resp = crud.update_profile_by_user_id(user_id, update_data)
    if resp.error:
        raise HTTPException(status_code=400, detail=resp.error.message)
    # fetch and return the updated profile
    profile = crud.get_profile_by_user_id(user_id)
    return profile



