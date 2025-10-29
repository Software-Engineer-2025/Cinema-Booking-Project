from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import uuid

# Make sure your imports point to the correct locations in your project
from auth.security import get_current_user
from . import crud
from .schemas import NewCardRequest, CardResponse

router = APIRouter(prefix="/cards", tags=["Payment Cards"])

@router.post("/", response_model=List[CardResponse], status_code=status.HTTP_201_CREATED)
def add_payment_card_endpoint(
    card_data: NewCardRequest, current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    data, error = crud.add_payment_card(user_id, card_data)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return data

@router.get("/", response_model=List[CardResponse])
def get_payment_cards_endpoint(current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    data, error = crud.get_payment_cards(user_id)
    if error:
        raise HTTPException(status_code=500, detail=error)
    return data

@router.delete("/{card_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_payment_card_endpoint(card_id: uuid.UUID, current_user: dict = Depends(get_current_user)):
    user_id = current_user["id"]
    data, error = crud.delete_payment_card(user_id, str(card_id))
    
    if error:
        raise HTTPException(status_code=500, detail=error)
    
    if not data:
        raise HTTPException(status_code=404, detail="Card not found or access denied.")
        
    return None

@router.patch("/{card_id}", response_model=CardResponse)
def update_payment_card_endpoint(
    card_id: uuid.UUID,
    card_data: NewCardRequest,
    current_user: dict = Depends(get_current_user)
):
    user_id = current_user["id"]
    data, error = crud.update_payment_card(user_id, str(card_id), card_data)
    if error:
        raise HTTPException(status_code=400, detail=error)
    return data