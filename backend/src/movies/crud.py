from .schemas import MovieCreate
from db.supabase import supabase

def create_movie(movie: MovieCreate):
    # Example: Insert into Supabase
    response = supabase.table("movie").insert(movie.dict()).execute()
    return response

def get_movies():
    response = supabase.table("movie").select("*").execute()
    return response.data

def get_movie(movie_id: int):
    response = supabase.table("movie").select("*").eq("id", movie_id).single().execute()
    return response.data

def delete_movie(movie_id: int):
    response = supabase.table("movie").delete().eq("id", movie_id).execute()
    return response

def get_genres():
    response = supabase.table("movie").select("genre").execute()
    genres = set()

    # Split genres seperated by , and put into set
    if response.data:
        for row in response.data:
            genre_field = row.get("genre")
            if genre_field:
                for genre in genre_field.split(","):
                    genres.add(genre.strip())

    return sorted(list(genres))
