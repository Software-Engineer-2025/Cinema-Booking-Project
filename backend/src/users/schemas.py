from pydantic import BaseModel
from typing import Optional

class UserProfileBase(BaseModel):
    user_id: int 
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_admin: Optional[bool] = False  
    promotional_list: Optional[bool] = False

class UserProfileCreate(UserProfileBase):
    pass 

class UserProfile(UserProfileBase):
    user_id: int

    class Config:
        from_attributes = True  # Updated from orm_mode for Pydantic v2

class UserLogin(BaseModel):
    email: str
    password: str

class UserProfileInDBBase(UserProfileBase):
    user_id: int

    class Config:
        from_attributes = True  # Updated from orm_mode for Pydantic v2

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_admin: Optional[bool] = None  # Updated field name
    promotional_list: Optional[bool] = None  # Updated field name
    email: Optional[str] = None
    password: Optional[str] = None        

__all__ = [
    "UserProfileBase", 
    "UserProfileCreate",
    "UserProfile",
    "UserLogin",
    "UserProfileInDBBase",
    "UserProfileUpdate",
]
 

