from pydantic import BaseModel, Field
from typing import Optional
import uuid
from datetime import datetime

# This model represents the full, unencrypted card details.
# It will be nested in both the request and the response.
class CardDetails(BaseModel):
    cardholder_name: str
    card_number: str = Field(..., min_length=13, max_length=19, description="The full payment card number.")
    expiry_month: int
    expiry_year: int
    
    cvv: str = Field(..., min_length=3, max_length=4)

# This is the model your frontend will send when creating a new card.
class NewCardRequest(BaseModel):
    # Frontend sends only the card details. Backend will compute/store last four and other fields.
    details: CardDetails

# This is the model your API will return.
# It includes the decrypted card_details.
class CardResponse(BaseModel):
    card_id: uuid.UUID
    card_last_four: str

    class Config:
        from_attributes = True