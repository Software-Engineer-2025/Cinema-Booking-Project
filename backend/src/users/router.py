from fastapi import APIRouter, HTTPException
from .schemas import UserCreate, UserLogin
from . import crud

router = APIRouter(prefix="/users", tags=["Users"])
@router.post("/register")
def register_user(user: UserCreate):
    result = crud.register_user(user)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"ok": True}

@router.post("/login")
def login_user(user: UserLogin):
    result = crud.login_user(user)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"token": result.data[0].token}

@router.get("/me")
def get_current_user():
    user = crud.get_current_user()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/me")
def delete_current_user():
    result = crud.delete_current_user()
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"ok": True}

@router.post("/logout")
def logout_user():
    result = crud.logout_user()
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"ok": True}

