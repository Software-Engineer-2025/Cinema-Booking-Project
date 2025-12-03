DELETE FROM booking WHERE booking_id BETWEEN 1 AND 5;

INSERT INTO booking (
    booking_id,
    user_id,
    show_id,
    booking_date,
    total_amount,
    status,
    payment_card_id
) VALUES
    (
        1,
        'b7440d39-1a66-4a52-a937-f95582d15027'::uuid,
        2, -- Show 2: Today at 1:00 PM
        now() - interval '3 days',
        52.00, -- 2 adults + 2 seniors
        'confirmed',
        '22222222-2222-2222-2222-222222222221'::uuid -- User's default Visa
    ),
    (
        2,
        'b7440d39-1a66-4a52-a937-f95582d15027'::uuid,
        7, -- Show 7: Tomorrow at 2:00 PM
        now() - interval '12 hours',
        15.00, -- 1 adult ticket
        'confirmed',
        '22222222-2222-2222-2222-222222222221'::uuid -- User's default Visa
    ),
    (
        3,
        'b7440d39-1a66-4a52-a937-f95582d15027'::uuid,
        15, -- Show 15: Tomorrow at 9:00 AM
        now() - interval '5 hours',
        38.00, -- 2 adults + 1 child
        'pending',
        '22222222-2222-2222-2222-222222222222'::uuid -- User's Amex card
    ),
    (
        4,
        'b7440d39-1a66-4a52-a937-f95582d15027'::uuid,
        3, -- Show 3: Today at 3:30 PM
        now() - interval '4 days',
        15.00, -- 1 adult ticket
        'cancelled',
        '22222222-2222-2222-2222-222222222221'::uuid -- User's default Visa
    ),
    (
        5,
        'b7440d39-1a66-4a52-a937-f95582d15027'::uuid,
        26, -- Show 26: Tomorrow at 9:30 AM
        now() - interval '30 minutes',
        24.00, -- 2 child tickets
        'confirmed',
        '22222222-2222-2222-2222-222222222223'::uuid -- User's Mastercard
    )
ON CONFLICT (booking_id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    show_id = EXCLUDED.show_id,
    booking_date = EXCLUDED.booking_date,
    total_amount = EXCLUDED.total_amount,
    status = EXCLUDED.status,
    payment_card_id = EXCLUDED.payment_card_id;

-- Reset the sequence for booking_id
SELECT setval('booking_booking_id_seq', (SELECT MAX(booking_id) FROM booking));
