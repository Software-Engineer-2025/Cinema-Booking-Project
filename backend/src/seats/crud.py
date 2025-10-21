from typing import List, Optional
from db.supabase import supabase  # Assumes db.supabase module exists and exposes a configured client

from .schemas import SeatCreate

# Define the table name for the Seat data
TABLE_NAME = "Seat"

def create_seat(seat: SeatCreate):
    """
    Inserts a new seat into the database.
    
    :param seat: The Pydantic model containing the seat details.
    :return: The response object from the Supabase insert operation.
    """
    # Insert seat data, returning the created object
    response = supabase.table(TABLE_NAME).insert(seat.model_dump()).select().single().execute()
    return response

def get_all_seats() -> List[dict]:
    """
    Retrieves all seats from the database.
    
    :return: A list of seat dictionaries.
    """
    # Select all columns from the Seat table
    response = supabase.table(TABLE_NAME).select("*").execute()
    return response.data

def get_seat_by_id(seat_id: int) -> Optional[dict]:
    """
    Retrieves a single seat by its unique ID.
    
    :param seat_id: The ID of the seat to fetch.
    :return: A seat dictionary, or None if not found.
    """
    try:
        # Select all columns for the specific seat_id and execute as a single result
        response = supabase.table(TABLE_NAME).select("*").eq("seat_id", seat_id).single().execute()
        return response.data
    except Exception as e:
        # Assume "Row not found" if an exception occurs during .single()
        if "Row not found" in str(e):
            return None
        raise e

def delete_seat(seat_id: int):
    """
    Deletes a seat by its ID.
    
    :param seat_id: The ID of the seat to delete.
    :return: The response object from the Supabase delete operation.
    """
    # Delete the seat where seat_id matches
    response = supabase.table(TABLE_NAME).delete().eq("seat_id", seat_id).execute()
    return response
