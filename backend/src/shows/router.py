from fastapi import APIRouter, HTTPException, Depends

from .schemas import Show, ShowCreate, ShowUpdate
from . import crud
from auth.security import require_admin

router = APIRouter(prefix="/shows", tags=["Shows"])

@router.post("/", response_model=Show)
def create_show(show: ShowCreate, _admin: dict = Depends(require_admin)):
    result = crud.create_show(show)
    
    if isinstance(result, dict) and result.get('error'):
        raise HTTPException(status_code=400, detail=result['error']['message'])
    elif hasattr(result, 'error') and result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    elif hasattr(result, 'data') and result.data:
        return result.data[0]
    else:
        raise HTTPException(status_code=500, detail="Unexpected response format")

@router.get("/", response_model=list[Show])
def list_shows():
    return crud.get_all_shows()

@router.get("/{show_id}", response_model=Show)
def get_show_by_id(show_id: int):
    show = crud.get_show_by_id(show_id)
    if not show:
        raise HTTPException(status_code=404, detail="Show not found")
    return show

@router.get("/movie/{movie_id}", response_model=list[Show])
def get_shows_by_movie(movie_id: int):
    shows = crud.get_shows_by_movie(movie_id)
    return shows

@router.get("/date/{date}", response_model=list[Show])
def get_shows_by_date(date: str):
    shows = crud.get_show_by_date(date)
    return shows

@router.put("/{show_id}", response_model=Show)
def update_show(show_id: int, show: ShowUpdate):
    result = crud.update_show(show_id, show)
    if "error" in result:
        raise HTTPException(status_code=result["status_code"], detail=result["error"])
    return result["data"]

@router.delete("/{show_id}")
def delete_show(show_id: int, _admin: dict = Depends(require_admin)):
    result = crud.delete_show(show_id)
    
    if isinstance(result, dict) and result.get('error'):
        raise HTTPException(status_code=404, detail=result['error']['message'])
    elif hasattr(result, 'error') and result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    elif hasattr(result, 'data') and result.data:
        return {"message": "Show deleted successfully", "deleted_show": result.data[0]}
    else:
        raise HTTPException(status_code=500, detail="Unexpected response format")
