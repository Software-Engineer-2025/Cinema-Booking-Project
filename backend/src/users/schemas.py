from pydantic import BaseModel
from typing import List, Optional

class UserBase(BaseModel):
    first_name : Optional[str] = None
    last_name : Optional[str] = None
    isAdmin : Optional[bool] = None
    promotions : Optional[List[str]] = None

class UserCreate(UserBase):
    pass 

class User(UserBase):
    id : int

    class Config:
        orm_mode = True 

class UserLogin(BaseModel):
    email : str
    password : str

class UserInDBBase(UserBase):
    id : int

    class Config:
        orm_mode = True

class UserUpdate(BaseModel):
    first_name : Optional[str] = None
    last_name : Optional[str] = None
    isAdmin : Optional[bool] = None
    promotions : Optional[List[str]] = None
    email : Optional[str] = None
    password : Optional[str] = None        

__all__ = [
    "UserBase", 
    "UserCreate",
    "User",
    "UserLogin",
    "UserInDBBase",
    "UserUpdate",
]
 

