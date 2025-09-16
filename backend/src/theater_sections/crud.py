from .schemas import TheaterSectionCreate, TheaterSectionUpdate
from db.supabase import supabase

def create_theater_section(section: TheaterSectionCreate):
    response = supabase.table("TheaterSection").insert(section.dict()).execute()
    return response

def get_theater_sections():
    response = supabase.table("TheaterSection").select("*").execute()
    return response.data

def get_theater_section(section_id: int):
    response = supabase.table("TheaterSection").select("*").eq("id", section_id).single().execute()
    return response.data

def update_theater_section(section_id: int, section: TheaterSectionUpdate):
    response = supabase.table("TheaterSection").update(section.dict()).eq("id", section_id).execute()
    return response

def delete_theater_section(section_id: int):
    response = supabase.table("TheaterSection").delete().eq("id", section_id).execute()
    return response


