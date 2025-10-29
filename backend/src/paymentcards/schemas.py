from pydantic import BaseModel, Field
from typing import Optional
import uuid
from datetime import datetime

# This model represents the full, unencrypted card details.
# It will be nested in both the request and the response.
class CardDetails(BaseModel):
    name: str
    cardNumber: str = Field(..., min_length=13, max_length=19, description="The full payment card number.")
    expDate: str
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
    card_details: CardDetails | object
    card_brand: str
    is_default: bool

    class Config:
        from_attributes = True