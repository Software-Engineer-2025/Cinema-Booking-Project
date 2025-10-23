from typing import Dict, List, Optional
from .schemas import MovieCreate
from db.supabase import supabase

def _transform_movie_data(movie: Dict) -> Dict:
    """Transforms a single movie object from the nested database result format 
       into the flat structure expected by the frontend components."""
    
    # 1. Handle Genres
    genres = []
    if movie.get('moviegenre'):
        for mg in movie['moviegenre']:
            if mg.get('genre') and mg['genre'].get('name'):
                genres.append(mg['genre']['name'])
    movie['genre'] = genres if genres else []

    # 2. Handle Showtimes (Combine 'date' and 'time' from nested 'show' array)
    show_times = []
    if movie.get('show'):
        for show_item in movie['show']:
            # Combines date and time into the expected timestamp string format: "YYYY-MM-DD HH:MM:SS"
            show_time = f"{show_item['date']} {show_item['time']}"
            show_times.append(show_time)
    movie['show_times'] = show_times  # <-- This creates the array Showtimes.tsx expects!
    
    # 3. Conver lists to strings
    if movie.get('cast_list') and isinstance(movie['cast_list'], str):
        movie['cast_list'] = [actor.strip() for actor in movie['cast_list'].split(',')]
    elif not isinstance(movie['cast_list'], list):
        movie['cast_list'] = []
            
    if movie.get('reviews') and isinstance(movie['reviews'], str):
        movie['reviews'] = [review.strip() for review in movie['reviews'].split(',')]
    elif not isinstance(movie['reviews'], list):
        movie['reviews'] = []

    # 4. Remove the raw nested relationship data to clean the final JSON object
    movie.pop('moviegenre', None)
    movie.pop('show', None) 
    
    return movie
    
def create_movie(movie: MovieCreate):
    response = supabase.table("movie").insert(movie.model_dump()).execute()
    return response

def get_movies():
    response = supabase.table("movie").select("""
        *,
        moviegenre (
            genre (
                name
            )
        ),
        show (
            date,
            time
        )
    """).execute()

    # Call the helper function on every movie object returned from the DB
    return [_transform_movie_data(movie) for movie in response.data]


def get_movie(movie_id: int):
    response = supabase.table("movie").select("""
        *,
        moviegenre (
            genre (
                name
            )
        ),
        show (
            date,
            time
        )
    """).eq("movie_id", movie_id).single().execute()
    
    if not response.data:
        return None
        
    # Call the helper function on the single returned object
    return _transform_movie_data(response.data)
 

def get_genres():
    response = supabase.table("genre").select("name").execute()
    if response.data:
        return [genre["name"] for genre in response.data]
    return []

def get_movies_by_genre(genre_name: str):
    response = supabase.table("movie").select("""
        *,
        moviegenre (
            genre (
                name
            )
        )
    """).eq("moviegenre.genre.name", genre_name).execute()
    # Apply transformation to the list of filtered movies
    return [_transform_movie_data(movie) for movie in response.data]