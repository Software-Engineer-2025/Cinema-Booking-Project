from .schemas import MovieCreate
from db.supabase import supabase

def create_movie(movie: MovieCreate):
    # Example: Insert into Supabase
    response = supabase.table("Movie").insert(movie.dict()).execute()
    return response

def get_movies():
    response = supabase.table("Movie").select("*").execute()
    return response.data

def get_movie(movie_id: int):
    response = supabase.table("Movie").select("*").eq("id", movie_id).single().execute()
    return response.data

def delete_movie(movie_id: int):
    response = supabase.table("Movie").delete().eq("id", movie_id).execute()
    return response