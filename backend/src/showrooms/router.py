from fastapi import APIRouter, HTTPException, Depends
from typing import List

from .schemas import Showroom, ShowroomCreate 

from .crud import get_all_showrooms, get_showroom_by_id, create_showroom

router = APIRouter()

@router.get("/showrooms", response_model=List[Showroom], summary="Get All Showrooms")
def read_showrooms():
    return get_all_showrooms()

@router.get("/showrooms/{showroom_id}", response_model=Showroom, summary="Get Showroom by ID")
def read_showroom(showroom_id: int):
    showroom = get_showroom_by_id(showroom_id)
    if showroom is None:
        raise HTTPException(status_code=404, detail="Showroom not found")
    return showroom

@router.post("/showrooms", response_model=Showroom, status_code=201, summary="Create New Showroom")
def add_showroom(showroom_data: ShowroomCreate):
    result = create_showroom(showroom_data)
    
    if isinstance(result, dict) and result.get('error'):
        raise HTTPException(status_code=400, detail=result['error']['message'])
    elif hasattr(result, 'error') and result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    elif hasattr(result, 'data') and result.data:
        return result.data[0]
    else:
        raise HTTPException(status_code=500, detail="Unexpected response format")