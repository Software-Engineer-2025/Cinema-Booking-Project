from fastapi import APIRouter, Depends, HTTPException, status
from security import get_current_user
from .crud import add_payment_card_for_user, get_payment_cards_for_user, delete_payment_card_for_user
from .schemas import PaymentCardCreate, PaymentCardOut

router = APIRouter()

@router.post("/cards/create", response_model=dict)
async def create_card(card_data: PaymentCardCreate, user: dict = Depends(get_current_user)):
    resp = add_payment_card_for_user(
        user_uuid=user["id"],
        card_details=card_data.model_dump(),
        card_brand=card_data.card_brand,
        is_default=card_data.is_default or False
    )
    if hasattr(resp, 'error') and resp.error:
        raise HTTPException(status_code=400, detail=resp.error.message)
    return {"status": "success", "card_id": getattr(resp, 'data', None)}

@router.get("/cards", response_model=list[dict])
async def list_cards(user: dict = Depends(get_current_user)):
    cards = get_payment_cards_for_user(user["id"])
    return cards

@router.delete("/cards/{card_id}", response_model=dict)
async def delete_card(card_id: str, user: dict = Depends(get_current_user)):
    resp = delete_payment_card_for_user(user["id"], card_id)
    if hasattr(resp, 'error') and resp.error:
        raise HTTPException(status_code=400, detail=resp.error.message)
    return {"status": "deleted"}

