from db.supabase import supabase
from typing import List, Optional, Tuple, Any
from .schemas import NewCardRequest


def add_payment_card(user_id: str, card_data: NewCardRequest) -> Tuple[Optional[List[dict]], Optional[str]]:
    """Encrypts and inserts a new payment card for a given user.

    The frontend sends only the unencrypted card details. We call the DB RPC
    to encrypt the JSON, store the encrypted blob in `card_details`, and store
    `card_last_four`. The API returns a minimal object with card_id and card_last_four.
    """

    # 1. Call the SQL function to encrypt the card details JSON.
    rpc_params = {"data_to_encrypt": card_data.details.dict()}
    encrypted_details_response = supabase.rpc("encrypt_payment_card", rpc_params).execute()

    if encrypted_details_response.data is None:
        return None, "Failed to encrypt card details. Ensure the encryption key is set."

    # 2. Prepare the payload for insertion. Keep other DB columns default/null as appropriate.
    new_card_payload: dict[str, Any] = {
        "user_id": user_id,
        "card_details": encrypted_details_response.data,
        "card_last_four": card_data.details.card_number[-4:],
    }

    # 3. Insert the new record.
    response = supabase.table("paymentcards").insert(new_card_payload).execute()

    if response.error:
        return None, getattr(response.error, "message", str(response.error))

    # response.data is typically a list of inserted rows. Return minimal info.
    try:
        inserted = response.data[0]
        minimal = [{
            "card_id": inserted.get("card_id"),
            "card_last_four": inserted.get("card_last_four"),
        }]
        return minimal, None
    except Exception:
        return None, "Unexpected response from DB after inserting card."

def get_payment_cards(user_id: str) -> Tuple[Optional[List[dict]], Optional[str]]:
    """Return minimal card info for the user (no full decrypted details).

    We intentionally do NOT decrypt card_details here — we only return the
    stored `card_id` and `card_last_four` so the frontend can display masked cards.
    """
    response = supabase.table("paymentcards").select("card_id, card_last_four").eq("user_id", user_id).execute()
    if response.error:
        return None, getattr(response.error, "message", str(response.error))

    return response.data, None

def delete_payment_card(user_id: str, card_id: str):
    """Deletes a specific payment card belonging to a user."""
    response = supabase.table("paymentcards").delete().eq("card_id", card_id).eq("user_id", user_id).execute()

    if response.error:
        return None, getattr(response.error, "message", str(response.error))

    return response.data, None
