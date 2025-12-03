DELETE FROM ticket WHERE booking_id BETWEEN 1 AND 5;

INSERT INTO ticket (
    booking_id,
    seat_id,
    show_id,
    ticket_type,
    price
) VALUES
    -- Booking 1: 2 adults + 2 seniors for show 2
    (1, 3, 2, 'adult', 15.00),
    (1, 4, 2, 'adult', 15.00),
    (1, 5, 2, 'senior', 11.00),
    (1, 6, 2, 'senior', 11.00),
    
    -- Booking 2: 1 adult for show 7
    (2, 7, 7, 'adult', 15.00),
    
    -- Booking 3: 2 adults + 1 child for show 15
    (3, 104, 15, 'adult', 15.00),
    (3, 105, 15, 'adult', 15.00),
    (3, 106, 15, 'child', 8.00),
    
    -- Booking 4: 1 adult for show 3 (cancelled booking)
    (4, 8, 3, 'adult', 15.00),
    
    -- Booking 5: 2 child tickets for show 26
    (5, 203, 26, 'child', 12.00),
    (5, 204, 26, 'child', 12.00);

SELECT setval('ticket_ticket_id_seq', (SELECT MAX(ticket_id) FROM ticket));