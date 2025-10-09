from pydantic import BaseModel
from typing import Optional

class UserBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_admin: Optional[bool] = False  
    promotional_list: Optional[bool] = False  

class UserCreate(UserBase):
    pass 

class User(UserBase):
    user_id: int

    class Config:
        from_attributes = True  # Updated from orm_mode for Pydantic v2

class UserLogin(BaseModel):
    email: str
    password: str

class UserInDBBase(UserBase):
    user_id: int

    class Config:
        from_attributes = True  # Updated from orm_mode for Pydantic v2

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    is_admin: Optional[bool] = None  # Updated field name
    promotional_list: Optional[bool] = None  # Updated field name
    email: Optional[str] = None
    password: Optional[str] = None        

__all__ = [
    "UserBase", 
    "UserCreate",
    "User",
    "UserLogin",
    "UserInDBBase",
    "UserUpdate",
]
 

