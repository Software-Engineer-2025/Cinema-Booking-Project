from pydantic import BaseModel, Field
from typing import Optional
# input
class PaymentCardCreate(BaseModel):
    card_number: str
    exp_month: int
    exp_year: int
    cvc: str
    card_brand: str
    is_default: Optional[bool] = False
#output
class PaymentCardOut(BaseModel):
    card_id: str
    card_last_four: str
    card_brand: str
    is_default: bool
    # Do not expose full card details
