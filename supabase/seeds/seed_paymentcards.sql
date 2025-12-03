DELETE FROM paymentcards WHERE user_id IN (
    '7e0c10b3-dc2b-44e9-a3e6-511868454067'::uuid,
    'b7440d39-1a66-4a52-a937-f95582d15027'::uuid
);

INSERT INTO paymentcards (
    card_id,
    user_id,
    card_details,
    card_last_four,
    card_brand,
    is_default,
    created_at
) VALUES
    (
        '22222222-2222-2222-2222-222222222221'::uuid,
        'b7440d39-1a66-4a52-a937-f95582d15027'::uuid,
        encrypt_payment_card('{"name":"Default Visa","cardNumber":"4111111111111111","cvv":"123","expDate":"12/25"}'::jsonb),
        '1234',
        'Visa',
        true,
        now() - interval '1 year'
    ),
    (
        '22222222-2222-2222-2222-222222222222'::uuid,
        'b7440d39-1a66-4a52-a937-f95582d15027'::uuid,
        encrypt_payment_card('{"name":"Default Amex","cardNumber":"378282246310005","cvv":"1234","expDate":"11/26"}'::jsonb),
        '9876',
        'American Express',
        false,
        now() - interval '2 months'
    ),
    (
        '22222222-2222-2222-2222-222222222223'::uuid,
        'b7440d39-1a66-4a52-a937-f95582d15027'::uuid,
        encrypt_payment_card('{"name":"Default Mastercard","cardNumber":"5555555555554444","cvv":"321","expDate":"10/25"}'::jsonb),
        '5678',
        'Mastercard',
        false,
        now() - interval '8 months'
    )
ON CONFLICT (card_id) DO UPDATE SET
    card_details = EXCLUDED.card_details,
    card_last_four = EXCLUDED.card_last_four,
    card_brand = EXCLUDED.card_brand,
    is_default = EXCLUDED.is_default,
    created_at = EXCLUDED.created_at;
