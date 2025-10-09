from typing import List, Optional
from .schemas import GenreCreate
from db.supabase import supabase 

TABLE_NAME = "genre"

def create_genre(genre: GenreCreate):
    response = supabase.table(TABLE_NAME).insert(genre.model_dump()).select().single().execute()
    return response

def get_all_genres() -> List[dict]:
    response = supabase.table(TABLE_NAME).select("*").order("name").execute()
    return response.data

def get_genre_by_id(genre_id: int) -> Optional[dict]:
    try:
        response = supabase.table(TABLE_NAME).select("*").eq("genre_id", genre_id).single().execute()
        return response.data
    except Exception:
        return None

def delete_genre(genre_id: int):
    response = supabase.table(TABLE_NAME).delete().eq("genre_id", genre_id).execute()
    return response