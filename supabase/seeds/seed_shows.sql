INSERT INTO Show (show_id, showroom_id, date, time, movie_id) 
VALUES
    -- Showroom 1, Today
    (1, 1, CURRENT_DATE, '10:00:00', 1),  
    (2, 1, CURRENT_DATE, '13:00:00', 7),  
    (3, 1, CURRENT_DATE, '15:30:00', 4),  
    (4, 1, CURRENT_DATE, '18:00:00', 1),  
    (5, 1, CURRENT_DATE, '21:00:00', 8),  

    -- Showroom 1, Tomorrow
    (6, 1, CURRENT_DATE + 1, '11:00:00', 7),  
    (7, 1, CURRENT_DATE + 1, '14:00:00', 1),  
    (8, 1, CURRENT_DATE + 1, '17:00:00', 4),  
    (9, 1, CURRENT_DATE + 1, '19:30:00', 8),  

    -- Showroom 2, Today
    (10, 2, CURRENT_DATE, '10:00:00', 2),  
    (11, 2, CURRENT_DATE, '12:30:00', 6),  
    (12, 2, CURRENT_DATE, '15:00:00', 5),  
    (13, 2, CURRENT_DATE, '17:30:00', 2),  
    (14, 2, CURRENT_DATE, '20:00:00', 8),  

    -- Showroom 2, Tomorrow
    (15, 2, CURRENT_DATE + 1, '09:00:00', 6),  
    (16, 2, CURRENT_DATE + 1, '11:30:00', 2),  
    (17, 2, CURRENT_DATE + 1, '14:00:00', 5),  
    (18, 2, CURRENT_DATE + 1, '16:30:00', 8),  
    (19, 2, CURRENT_DATE + 1, '19:00:00', 2),  

    -- Showroom 3, Today
    (20, 3, CURRENT_DATE, '10:00:00', 3),  
    (21, 3, CURRENT_DATE, '12:00:00', 6),  
    (22, 3, CURRENT_DATE, '14:30:00', 9),  
    (23, 3, CURRENT_DATE, '16:30:00', 3),  
    (24, 3, CURRENT_DATE, '18:30:00', 10), 
    (25, 3, CURRENT_DATE, '20:30:00', 9),  

    -- Showroom 3, Tomorrow
    (26, 3, CURRENT_DATE + 1, '09:30:00', 10), 
    (27, 3, CURRENT_DATE + 1, '11:30:00', 3),  
    (28, 3, CURRENT_DATE + 1, '13:30:00', 9),  
    (29, 3, CURRENT_DATE + 1, '15:30:00', 6),  
    (30, 3, CURRENT_DATE + 1, '17:45:00', 10), 
    (31, 3, CURRENT_DATE + 1, '19:45:00', 3),
    
    -- Showroom 1, Day After Tomorrow
    (32, 1, CURRENT_DATE + 2, '10:30:00', 11),  
    (33, 1, CURRENT_DATE + 2, '13:30:00', 15),  
    (34, 1, CURRENT_DATE + 2, '16:00:00', 11),  
    (35, 1, CURRENT_DATE + 2, '19:00:00', 15),  

    -- Showroom 2, Day After Tomorrow
    (36, 2, CURRENT_DATE + 2, '11:00:00', 13),  
    (37, 2, CURRENT_DATE + 2, '14:00:00', 14),  
    (38, 2, CURRENT_DATE + 2, '17:00:00', 13),  
    (39, 2, CURRENT_DATE + 2, '20:00:00', 12),  

    -- Showroom 3, Day After Tomorrow
    (40, 3, CURRENT_DATE + 2, '10:00:00', 18),  
    (41, 3, CURRENT_DATE + 2, '12:30:00', 16),  
    (42, 3, CURRENT_DATE + 2, '15:00:00', 17),  
    (43, 3, CURRENT_DATE + 2, '18:00:00', 18);  
