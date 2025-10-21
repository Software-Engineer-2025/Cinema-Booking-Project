-- Seed `userprofile` table to match migration: user_id BIGSERIAL, first_name, last_name, is_admin, promotional_list
-- We provide explicit numeric user_id values so other seed files can reference them predictably.

INSERT INTO UserProfile (user_id, first_name, last_name, is_admin, promotional_list) VALUES
	(1, 'Alice', 'Example', false, false),
	(2, 'Bob', 'Example', false, true),
	(3, 'Carol', 'Example', true, false),
	(4, 'Dave', 'Example', false, false);

-- Ensure sequence continues after explicit inserts
SELECT setval(pg_get_serial_sequence('UserProfile', 'user_id'), (SELECT COALESCE(MAX(user_id), 0) FROM UserProfile), true);
