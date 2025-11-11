from typing import List, Optional, Dict, Any
from .schemas import GenreCreate
from db.supabase import supabase_admin


def create_genre(genre: GenreCreate) -> Dict[str, Any]:
    """Create a new genre with auto-assigned ID."""
    try:
        max_response = supabase_admin.table("genre").select("genre_id").order("genre_id", desc=True).limit(1).execute()
        next_id = (max_response.data[0]["genre_id"] + 1) if max_response.data else 1
        
        genre_data = genre.model_dump()
        genre_data["genre_id"] = next_id
        
        response = supabase_admin.table("genre").insert(genre_data).execute()
        
        if response.data:
            return {"data": response.data[0], "status_code": 201}
        else:
            return {"error": "Failed to create genre", "status_code": 500}
            
    except Exception as e:
        return {"error": str(e), "status_code": 500}

def get_all_genres() -> List[dict]:
    """Get all genres ordered by name."""
    try:
        response = supabase_admin.table("genre").select("*").order("name").execute()
        return response.data if response.data else []
    except Exception as e:
        return []

def get_genre_by_id(genre_id: int) -> Optional[dict]:
    """Get a genre by its ID."""
    try:
        response = supabase_admin.table("genre").select("*").eq("genre_id", genre_id).execute()
        return response.data[0] if response.data else None
    except Exception:
        return None

def delete_genre(genre_id: int) -> Dict[str, Any]:
    """Delete a genre by its ID."""
    try:
        response = supabase_admin.table("genre").delete().eq("genre_id", genre_id).execute()
        if response.data:
            return {"data": "Genre deleted successfully", "status_code": 200}
        else:
            return {"error": "Genre not found", "status_code": 404}
    except Exception as e:
        return {"error": str(e), "status_code": 500}