from pydantic import BaseModel
from typing import Optional
import uuid


class UserProfileCreate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None  # Added email field
    promotional_list: Optional[bool] = False


class UserLogin(BaseModel):
    email: str
    password: str


class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None  # Added email field
    promotional_list: Optional[bool] = None

class UserProfileResponse(BaseModel):
    id: uuid.UUID
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[str] = None  # Added email field
    is_admin: bool
    promotional_list: bool

    class Config:
        from_attributes = True # Allows Pydantic to read data from database models

