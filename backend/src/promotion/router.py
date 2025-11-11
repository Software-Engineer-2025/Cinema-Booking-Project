from fastapi import APIRouter, HTTPException, Response
from .schemas import (
    Promotion, 
    PromotionCreate, 
    PromotionValidationRequest, 
    PromotionValidationResponse
)
from . import crud

router = APIRouter(prefix="/promotions", tags=["Promotions"])

@router.post("/", response_model=Promotion)
async def create_promotion(promotion: PromotionCreate):
    result = await crud.create_promotion(promotion)
    if not result or len(result) == 0:
        raise HTTPException(status_code=400, detail="Failed to create promotion")
    return result[0]

@router.get("/", response_model=list[Promotion])
async def list_promotions():
    return await crud.get_promotions()

@router.get("/{promotion_id}", response_model=Promotion)
async def get_promotion(promotion_id: str):
    promotion = await crud.get_promotion(promotion_id)
    if not promotion:
        raise HTTPException(status_code=404, detail="Promotion not found")
    return promotion

@router.delete("/{promotion_id}", status_code=204)
async def delete_promotion(promotion_id: str):  
    success = await crud.delete_promotion(promotion_id)
    if not success:
        raise HTTPException(status_code=404, detail="Promotion not found")
    return Response(status_code=204)

@router.post("/validate", response_model=PromotionValidationResponse)
async def validate_promotion_code(request: PromotionValidationRequest):
    """
    Validate a promotion code for booking.
    Only checks if the promo code exists and is active.
    User eligibility (promotion=true) should be checked in the booking system.
    """
    result = await crud.validate_promotion_code(request.promo_code)
    
    if not result["valid"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return PromotionValidationResponse(
        valid=True,
        discount=result["discount"]
    )

@router.get("/email-list/{user_id}")
async def check_email_list_status(user_id: str):
    """
    Check if a user is on the email list (opted-in for promotions).
    Returns user's email list status and promotion eligibility.
    """
    result = await crud.check_user_email_list_status(user_id)
    
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    
    return result