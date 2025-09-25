from .schemas import TheaterSectionCreate, TheaterSectionUpdate
from db.supabase import supabase

def create_theater_section(section: TheaterSectionCreate):
    response = supabase.table("theatersection").insert(section.dict()).execute()
    return response

def get_theater_sections():
    response = supabase.table("theatersection").select("*").execute()
    return response.data

def get_theater_section(theater_theater_section_id: int):
    response = supabase.table("theatersection").select("*").eq("theater_section_id", theater_section_id).single().execute()
    return response.data

def update_theater_section(theater_theater_section_id: int, section: TheaterSectionUpdate):
    response = supabase.table("theatersection").update(section.dict()).eq("theater_section_id", theater_section_id).execute()
    return response

def delete_theater_section(theater_theater_section_id: int):
    response = supabase.table("theatersection").delete().eq("theater_section_id", theater_section_id).execute()
    return response


