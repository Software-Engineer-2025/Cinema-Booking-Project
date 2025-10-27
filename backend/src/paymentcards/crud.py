from db.supabase import supabase
from typing import List, Optional

def add_payment_card_for_user(user_uuid: str, card_details: dict, card_brand: str, is_default: bool):
    rpc = supabase.rpc("encrypt_payment_card", {"data_to_encrypt": card_details}).execute()
    if rpc.error:
        return rpc
    encrypted = rpc.data
    payload = {
        "user_id": user_uuid,
        "card_details": encrypted,
        "card_last_four": (card_details.get("card_number") or "")[-4:],
        "card_brand": card_brand,
        "is_default": is_default,
    }
    insert_resp = supabase.table("paymentcards").insert(payload).execute()
    return insert_resp

def get_payment_cards_for_user(user_uuid: str) -> List[dict]:
    resp = supabase.table("paymentcards").select("*").eq("user_id", user_uuid).execute()
    if resp.error:
        return []
    results: List[dict] = []
    for card in resp.data or []:
        rpc = supabase.rpc("decrypt_payment_card", {"encrypted_data": card.get("card_details")}).execute()
        if rpc.error:
            continue
        card["card_details"] = rpc.data
        results.append(card)
    return results

def delete_payment_card_for_user(user_uuid: str, card_id: str):
    resp = supabase.table("paymentcards").delete().eq("card_id", card_id).eq("user_id", user_uuid).execute()
    return resp
