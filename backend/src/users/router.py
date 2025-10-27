from fastapi import APIRouter, HTTPException, Depends
from .schemas import UserProfileCreate, UserLogin, UserProfileUpdate, UserProfileResponse, NewCardRequest
from . import crud
from security import get_current_user
from typing import List

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/register")
def register_user(user: UserProfileCreate):
    result = crud.create_user(user)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"ok": True}


@router.post("/login")
def login_user(user: UserLogin):
    result = crud.login_user(user)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"token": result.data[0].token}


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


@router.post("/cards", response_model=List[dict])
def add_payment_card(card_data: NewCardRequest, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    resp = crud.add_payment_card_for_user(
        user_id,
        card_data.details.model_dump(),
        card_data.card_brand,
        bool(card_data.is_default),
    )
    if resp.error:
        raise HTTPException(status_code=400, detail=getattr(resp.error, 'message', 'Failed to add card'))
    return resp.data


@router.get("/cards", response_model=List[dict])
def get_payment_cards(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    cards = crud.get_payment_cards_for_user(user_id)
    return cards


@router.delete("/cards/{card_id}")
def delete_payment_card(card_id: str, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    resp = crud.delete_payment_card_for_user(user_id, card_id)
    if resp.error or not resp.data:
        raise HTTPException(status_code=404, detail="Card not found or access denied")
    return {"message": "Card deleted successfully"}



