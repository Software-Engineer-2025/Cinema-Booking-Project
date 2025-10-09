from typing import List, Optional, Dict
from .schemas import Show, ShowCreate
from db.supabase import supabase 

TABLE_NAME = "show"

def get_all_shows() -> List[dict]:
    response = supabase.table(TABLE_NAME).select("*").execute()
    return response.data

# def get_all_shows_by_date(date: DATE) -> List[dict]:
#     response = supabase.table(TABLE_NAME).select("*").execute().eq("date")
#     return response.data

def get_show_by_id(show_id: int) -> Optional[dict]:
    try:
        response = supabase.table(TABLE_NAME).select("*").eq("show_id", show_id).single().execute()
        return response.data
    except Exception:
        return None

def get_shows_by_movie(movie_id: int) -> List[Dict]:
    response = supabase.table(TABLE_NAME).select("*").eq("movie_id", movie_id).execute()
    return response.data

def create_show(show: ShowCreate):
    response = supabase.table(TABLE_NAME).insert(show.model_dump()).select().single().execute()
    return response