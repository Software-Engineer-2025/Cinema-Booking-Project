from .schemas import MovieCreate
from db.supabase import supabase

def create_movie(movie: MovieCreate):
    # Example: Insert into Supabase
    response = supabase.table("movies").insert(movie.dict()).execute()
    return response

def get_movies():
    response = supabase.table("movies").select("*").execute()
    return response.data

def get_movie(movie_id: int):
    response = supabase.table("movies").select("*").eq("id", movie_id).single().execute()
    return response.data

def delete_movie(movie_id: int):
    response = supabase.table("movies").delete().eq("id", movie_id).execute()
    return response