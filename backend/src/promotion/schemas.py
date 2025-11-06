from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date

class PromotionBase(BaseModel):
    promo_code: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    discount: float

class PromotionCreate(PromotionBase):
    promotion_id: int

class Promotion(PromotionBase):
    promotion_id: int  # Changed to match database column name

    class Config:
        from_attributes = True

class PromotionValidationRequest(BaseModel):
    user_id: str
    promo_code: str

class PromotionValidationResponse(BaseModel):
    valid: bool
    error: Optional[str] = None
    discount: Optional[float] = None
    
class PromotionApplicationResponse(BaseModel):
    success: bool
    message: Optional[str] = None
    error: Optional[str] = None
    discount: Optional[float] = None

class PromotionEligibilityResponse(BaseModel):
    eligible: bool
    message: str