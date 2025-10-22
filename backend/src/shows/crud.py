from typing import List, Optional, Dict
from .schemas import Show, ShowCreate
from db.supabase import supabase 



def get_all_shows() -> List[dict]:
    response = supabase.table("show").select("*").execute()
    return response.data

# def get_all_shows_by_date(date: DATE) -> List[dict]:
#     response = supabase.table("show").select("*").execute().eq("date")
#     return response.data

def get_show_by_id(show_id: int) -> Optional[dict]:
    try:
        response = supabase.table("show").select("*").eq("show_id", show_id).single().execute()
        return response.data
    except Exception:
        return None

def get_shows_by_movie(movie_id: int) -> List[Dict]:
    response = supabase.table("show").select("*").eq("movie_id", movie_id).execute()
    return response.data

def create_show(show: ShowCreate):
    response = supabase.table("show").insert(show.model_dump()).select().single().execute()
    return response