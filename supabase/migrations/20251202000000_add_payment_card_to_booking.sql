-- Add payment_card_id column to booking table to track which card was used for payment
ALTER TABLE booking 
ADD COLUMN payment_card_id UUID REFERENCES paymentcards(card_id) ON DELETE SET NULL;

-- Add index for faster queries
CREATE INDEX idx_booking_payment_card ON booking(payment_card_id);

COMMENT ON COLUMN booking.payment_card_id IS 'References the payment card used for this booking';
