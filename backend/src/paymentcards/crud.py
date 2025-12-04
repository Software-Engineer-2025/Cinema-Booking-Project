from db.supabase import supabase
from typing import List, Optional, Tuple, Any
from .schemas import NewCardRequest, CardResponse, CardDetails


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
        "card_last_four": card_data.details.cardNumber[-4:],
        "card_brand": ""
    }

    # 3. Insert the new record.
    response = supabase.table("paymentcards").insert(new_card_payload).execute()

    # response.data is typically a list of inserted rows. Return minimal info.
    try:
        inserted = response.data
        return inserted, None
    except Exception:
        return None, "Unexpected response from DB after inserting card."

def get_payment_cards(user_id: str) -> Tuple[Optional[List[dict]], Optional[str]]:
    """
    Return full payment card details for the user.
    """
    # Fetch cards for the user
    response = supabase.table("paymentcards").select(
        "card_id, card_last_four, card_details, card_brand, is_default"
    ).eq("user_id", user_id).execute()

    decrypted_cards = []

    for card in response.data:
        encrypted = card.get("card_details")
        if not encrypted:
            continue

        # Call the DB method to decrypt in Migration/functions.sql
        try:
            decrypt_resp = supabase.rpc(
                "decrypt_payment_card", {"encrypted_data": encrypted}
            ).execute()

            details = CardDetails(
                name=decrypt_resp.data["name"],
                cardNumber=decrypt_resp.data["cardNumber"],
                cvv=decrypt_resp.data["cvv"],
                expDate=decrypt_resp.data["expDate"],
            )
        except Exception:
            # Fallback
            details = CardDetails(
                name="",
                cardNumber="****",
                cvv="***",
                expDate="",
            )

        decrypted_cards.append(CardResponse(
            card_id=card["card_id"],
            card_last_four=card["card_last_four"],
            card_brand=card.get("card_brand"),
            is_default=card.get("is_default", False),
            card_details=details,
        ))

    return decrypted_cards, None


def delete_payment_card(user_id: str, card_id: str):
    """Deletes a specific payment card belonging to a user."""
    response = supabase.table("paymentcards").delete().eq("card_id", card_id).eq("user_id", user_id).execute()

    return response.data, None


def update_payment_card(user_id: str, card_id: str, card_data: NewCardRequest) -> Tuple[Optional[dict], Optional[str]]:
    """Updates a specific payment card belonging to a user."""
    # Encrypt the updated card details
    rpc_params = {"data_to_encrypt": card_data.details.dict()}
    encrypted_response = supabase.rpc("encrypt_payment_card", rpc_params).execute()

    if encrypted_response.data is None:
        return None, "Failed to encrypt updated card details."

    update_payload = {
        "card_details": encrypted_response.data,
        "card_last_four": card_data.details.cardNumber[-4:],
    }

    # Update only this user's card
    response = (
        supabase.table("paymentcards")
        .update(update_payload)
        .eq("user_id", user_id)
        .eq("card_id", card_id)
        .execute()
    )

    updated = response.data[0] if response.data else None
    if not updated:
        return None, "Card not found or not updated."

    # Decrypt again to return
    decrypt_resp = supabase.rpc("decrypt_payment_card", {"encrypted_data": updated["card_details"]}).execute()
    decrypted_card = CardResponse(
        card_id=updated["card_id"],
        card_last_four=updated["card_last_four"],
        card_brand=updated.get("card_brand", ""),
        is_default=updated.get("is_default", False),
        card_details=CardDetails(
            name=decrypt_resp.data["name"],
            cardNumber=decrypt_resp.data["cardNumber"],
            cvv=decrypt_resp.data["cvv"],
            expDate=decrypt_resp.data["expDate"],
        ),
    )

    return decrypted_card, None