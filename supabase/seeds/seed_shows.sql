INSERT INTO Show (show_id, showroom_id, date, time, movie_id) 
VALUES
    -- The Dark Knight (movie_id = 1) - Scheduled on Showroom 1
    (1, 1, '2025-09-20', '19:00:00', 1),
    (2, 1, '2025-09-21', '21:00:00', 1),

    -- Demon Slayer (movie_id = 2) - Scheduled on Showroom 2
    (3, 2, '2025-09-16', '16:30:00', 2),
    (4, 2, '2025-09-17', '20:00:00', 2),
    (3, 2, '2025-09-16', '12:30:00', 2),
    (4, 2, '2025-09-17', '08:00:00', 2),

    -- The Long Walk (movie_id = 3) - Scheduled on Showroom 3
    (5, 3, '2025-09-16', '18:00:00', 3),
    (6, 3, '2025-09-17', '19:00:00', 3),

    -- Spinal Tap II (movie_id = 4) - Scheduled on Showroom 1
    (7, 1, '2025-09-16', '17:00:00', 4),
    (8, 1, '2025-09-17', '19:30:00', 4),

    -- The Roses (movie_id = 5) - Scheduled on Showroom 2
    (9, 2, '2025-09-16', '20:30:00', 5), 
    (10, 2, '2025-09-17', '23:30:00', 5),

    -- Love, Brooklyn (movie_id = 6) - Scheduled on Showroom 3
    (11, 3, '2025-09-16', '14:00:00', 6),
    (12, 3, '2025-09-17', '18:00:00', 6),

    -- Downton Abbey: The Grand Finale (movie_id = 7) - Scheduled on Showroom 1
    (13, 1, '2025-09-16', '13:00:00', 7),
    (14, 1, '2025-09-17', '15:30:00', 7),

    -- Twinless (movie_id = 8) - Scheduled on Showroom 2
    (15, 2, '2025-09-16', '19:00:00', 8), 
    (16, 2, '2025-09-17', '22:00:00', 8);