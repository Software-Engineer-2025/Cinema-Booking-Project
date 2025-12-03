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
        decode('566973612a2a2a2a', 'hex'), -- Encrypted placeholder for Visa****
        '1234',
        'Visa',
        true,
        now() - interval '1 year'
    ),
    (
        '22222222-2222-2222-2222-222222222222'::uuid,
        'b7440d39-1a66-4a52-a937-f95582d15027'::uuid,
        decode('416d6572696361206578707265737320', 'hex'), -- Encrypted placeholder for Amex
        '9876',
        'American Express',
        false,
        now() - interval '2 months'
    ),
    (
        '22222222-2222-2222-2222-222222222223'::uuid,
        'b7440d39-1a66-4a52-a937-f95582d15027'::uuid,
        decode('4d6173746572636172642a2a2a2a', 'hex'), -- Encrypted placeholder for Mastercard****
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
