from fastapi import APIRouter, HTTPException
from .schemas import Theater, TheaterCreate
from . import crud

router = APIRouter(prefix="/theaters", tags=["Theaters"])

@router.post("/", response_model=Theater)
def create_theater(theater: TheaterCreate):
    result = crud.create_theater(theater)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return result.data[0]

@router.get("/", response_model=list[Theater])
def list_theaters():
    return crud.get_theaters()

@router.get("/{theater_id}", response_model=Theater)
def get_theater(theater_id: int):
    theater = crud.get_theater(theater_id)
    if not theater:
        raise HTTPException(status_code=404, detail="Theater not found")
    return theater

@router.delete("/{theater_id}")
def delete_theater(theater_id: int):
    result = crud.delete_theater(theater_id)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"ok": True}

