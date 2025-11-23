from typing import Dict, List, Optional
from .schemas import MovieCreate
from db.supabase import supabase, supabase_admin

def _transform_movie_data(movie: Dict) -> Dict:
    
    genres = []
    if movie.get('moviegenre'):
        for mg in movie['moviegenre']:
            if mg.get('genre') and mg['genre'].get('name'):
                genres.append(mg['genre']['name'])
    movie['genre'] = genres if genres else []

    show_times = []
    if movie.get('show'):
        for show_item in movie['show']:
            show_time = f"{show_item['date']} {show_item['time']}"
            show_times.append(show_time)
    movie['show_times'] = show_times  
    
    if movie.get('cast_list') and isinstance(movie['cast_list'], str):
        movie['cast_list'] = [actor.strip() for actor in movie['cast_list'].split(',')]
    elif not isinstance(movie['cast_list'], list):
        movie['cast_list'] = []
            
    if movie.get('reviews') and isinstance(movie['reviews'], str):
        movie['reviews'] = [review.strip() for review in movie['reviews'].split(',')]
    elif not isinstance(movie['reviews'], list):
        movie['reviews'] = []

    movie.pop('moviegenre', None)
    movie.pop('show', None) 
    
    return movie
    
def _transform_response_for_api(movie_data: Dict) -> Dict:
    if movie_data.get('cast_list'):
        if isinstance(movie_data['cast_list'], str):
            movie_data['cast_list'] = [actor.strip() for actor in movie_data['cast_list'].split(',') if actor.strip()]
    else:
        movie_data['cast_list'] = []
    
    if movie_data.get('reviews'):
        if isinstance(movie_data['reviews'], str):
            movie_data['reviews'] = [review.strip() for review in movie_data['reviews'].split(',') if review.strip()]
    else:
        movie_data['reviews'] = []
        
    return movie_data

def create_movie(movie: MovieCreate):
    try:
        movie_data = movie.model_dump()
        
        max_result = supabase_admin.table("movie").select("movie_id").order("movie_id", desc=True).limit(1).execute()
        if max_result.data:
            next_id = max_result.data[0]['movie_id'] + 1
        else:
            next_id = 1
        
        movie_data['movie_id'] = next_id
        
        if movie_data.get('release_date'):
            movie_data['release_date'] = movie_data['release_date'].isoformat()
        
        if movie_data.get('cast_list') is not None and isinstance(movie_data['cast_list'], list):
            movie_data['cast_list'] = ', '.join(movie_data['cast_list'])
        
        if movie_data.get('reviews') is not None and isinstance(movie_data['reviews'], list):
            movie_data['reviews'] = ', '.join(movie_data['reviews'])
            
        response = supabase_admin.table("movie").insert(movie_data).execute()
        
        if hasattr(response, 'data') and response.data:
            response.data[0] = _transform_response_for_api(response.data[0])
            
        return response
    except Exception as e:
        return {"error": {"message": str(e)}, "data": None}

def get_movies():
    response = supabase_admin.table("movie").select("""
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

    return [_transform_movie_data(movie) for movie in response.data]


def get_movie(movie_id: int):
    response = supabase_admin.table("movie").select("""
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
        
    return _transform_movie_data(response.data)
 

def get_genres():
    response = supabase_admin.table("genre").select("name").execute()
    if response.data:
        return [genre["name"] for genre in response.data]
    return []

def get_movies_by_genre(genre_name: str):
    response = supabase_admin.table("movie").select("""
        *,
        moviegenre (
            genre (
                name
            )
        )
    """).eq("moviegenre.genre.name", genre_name).execute()
    return [_transform_movie_data(movie) for movie in response.data]

def delete_movie(movie_id: int):
    try:
        supabase_admin.table("moviegenre").delete().eq("movie_id", movie_id).execute()
        response = supabase_admin.table("movie").delete().eq("movie_id", movie_id).execute()
        if not response.data:
            return {"error": "Movie not found", "status_code": 404}
        return {"success": True, "data": response.data}
    except Exception as e:
        print(f"Delete failed: {e}")
        return {"error": str(e), "status_code": 500}