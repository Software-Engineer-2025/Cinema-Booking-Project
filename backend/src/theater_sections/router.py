from fastapi import APIRouter, HTTPException
from .schemas import TheaterSection, TheaterSectionCreate
from . import crud

router = APIRouter(prefix="/theater_sections", tags=["Theater Sections"])

@router.post("/", response_model=TheaterSection)
def create_theater_section(section: TheaterSectionCreate):
    result = crud.create_theater_section(section)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return result.data[0]

@router.get("/", response_model=list[TheaterSection])
def list_theater_sections():
    return crud.get_theater_sections()

@router.get("/{section_id}", response_model=TheaterSection)
def get_theater_section(section_id: int):
    section = crud.get_theater_section(section_id)
    if not section:
        raise HTTPException(status_code=404, detail="Theater section not found")
    return section

@router.delete("/{section_id}")
def delete_theater_section(section_id: int):
    result = crud.delete_theater_section(section_id)
    if result.error:
        raise HTTPException(status_code=400, detail=result.error.message)
    return {"ok": True}


