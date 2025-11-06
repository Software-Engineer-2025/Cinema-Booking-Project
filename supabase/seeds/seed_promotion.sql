-- Clear existing promotion data
TRUNCATE TABLE promotion RESTART IDENTITY CASCADE;

-- Insert promotion seed data
INSERT INTO promotion (promotion_id, promo_code, discount, start_date, end_date)
VALUES
    (1, 'BLACKFRIDAY', 20, '2025-11-24', '2025-11-30'),
    (2, 'NEWYEAR2025', 15, '2025-12-31', '2026-01-07'),
    (3, 'SPRINGSALE', 10, '2026-03-01', '2026-03-31');