from fastapi import APIRouter, HTTPException, Response
from .schemas import (
    Promotion, 
    PromotionCreate, 
    PromotionValidationRequest, 
    PromotionValidationResponse,
    PromotionApplicationResponse,
    PromotionEligibilityResponse
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
async def validate_promotion(request: PromotionValidationRequest):
    """
    Validate if a user can use a specific promotion.
    Only users with promotion=false can use promotions.
    """
    result = await crud.validate_promotion_for_user(request.user_id, request.promo_code)
    
    if not result["valid"]:
        raise HTTPException(status_code=400, detail=result["error"])
    
    return PromotionValidationResponse(
        valid=True,
        discount=result["discount"]
    )

@router.post("/apply", response_model=PromotionApplicationResponse)
async def apply_promotion(request: PromotionValidationRequest):
    """
    Apply a promotion to a user. This marks the user as having used a promotion
    (sets promotion=true), preventing future promotion usage.
    Only users with promotion=false can use promotions.
    """
    result = await crud.apply_promotion_to_user(request.user_id, request.promo_code)
    
    if not result.get("success", False):
        raise HTTPException(status_code=400, detail=result.get("error", "Failed to apply promotion"))
    
    return PromotionApplicationResponse(
        success=True,
        message=result["message"],
        discount=result["discount"]
    )

@router.get("/eligibility/{user_id}", response_model=PromotionEligibilityResponse)
async def check_promotion_eligibility(user_id: str):
    """
    Check if a user is eligible to use promotions.
    Users are only eligible if their promotion field is false.
    """
    result = await crud.check_user_promotion_eligibility(user_id)
    
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    
    return PromotionEligibilityResponse(
        eligible=result["eligible"],
        message=result["message"]
    )