from pydantic import BaseModel
from typing import Optional
import uuid


class UserProfileCreate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    promotional_list: Optional[bool] = False


class UserLogin(BaseModel):
    email: str
    password: str


class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    promotional_list: Optional[bool] = None

class UserProfileResponse(BaseModel):
    id: uuid.UUID
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_admin: bool
    promotional_list: bool

    class Config:
        from_attributes = True # Allows Pydantic to read data from database models


# Card-related schemas
class CardDetails(BaseModel):
    cardholder_name: str
    card_number: str
    expiry_month: int
    expiry_year: int
    cvv: str


class NewCardRequest(BaseModel):
    details: CardDetails
    card_brand: str
    is_default: Optional[bool] = False


class CardResponse(BaseModel):
    card_id: str
    user_id: str
    card_details: CardDetails
    card_last_four: str
    card_brand: Optional[str]
    is_default: bool
    created_at: str