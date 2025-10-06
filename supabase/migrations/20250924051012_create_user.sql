CREATE TABLE UserProfile (
    user_id BIGSERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    promotional_list BOOLEAN DEFAULT FALSE
);