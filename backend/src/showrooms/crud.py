from typing import List, Optional
from db.supabase import supabase  # Assumes db.supabase module exists and exposes a configured client

from .schemas import ShowroomCreate

# Define the table name for the Showroom data
TABLE_NAME = "Showroom"

def create_showroom(showroom: ShowroomCreate):
    """
    Inserts a new showroom into the database.
    
    :param showroom: The Pydantic model containing the showroom capacity.
    :return: The response object from the Supabase insert operation.
    """
    # Insert the capacity into the Showroom table, returning the created object
    response = supabase.table(TABLE_NAME).insert(showroom.model_dump()).select().single().execute()
    return response

def get_all_showrooms() -> List[dict]:
    """
    Retrieves all showrooms from the database.
    
    :return: A list of showroom dictionaries.
    """
    # Select all columns from the Showroom table
    response = supabase.table(TABLE_NAME).select("*").execute()
    
    # Supabase response data is already clean, so no transformation is needed, 
    # just return the raw data list.
    return response.data

def get_showroom_by_id(showroom_id: int) -> Optional[dict]:
    """
    Retrieves a single showroom by its unique ID.
    
    :param showroom_id: The ID of the showroom to fetch.
    :return: A showroom dictionary, or None if not found.
    """
    # Select all columns for the specific showroom_id and execute as a single result
    try:
        response = supabase.table(TABLE_NAME).select("*").eq("showroom_id", showroom_id).single().execute()
        return response.data
    except Exception as e:
        # Supabase client often raises an exception if .single() finds no row.
        # We assume this means the row was not found and return None.
        if "Row not found" in str(e):
            return None
        # Re-raise other unexpected exceptions
        raise e

def update_showroom(showroom_id: int, showroom_data: ShowroomCreate):
    """
    Updates the capacity of an existing showroom.
    
    :param showroom_id: The ID of the showroom to update.
    :param showroom_data: The Pydantic model containing the updated capacity.
    :return: The response object from the Supabase update operation.
    """
    # Update the showroom capacity where showroom_id matches
    response = supabase.table(TABLE_NAME).update(showroom_data.model_dump()).eq("showroom_id", showroom_id).execute()
    return response

def delete_showroom(showroom_id: int):
    """
    Deletes a showroom by its ID.
    
    :param showroom_id: The ID of the showroom to delete.
    :return: The response object from the Supabase delete operation.
    """
    # Delete the showroom where showroom_id matches
    response = supabase.table(TABLE_NAME).delete().eq("showroom_id", showroom_id).execute()
    return response
