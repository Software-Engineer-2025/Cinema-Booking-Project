CREATE TABLE UserProfile (
    user_id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    isAdmin BOOLEAN DEFAULT FALSE,
    promotional_list BOOLEAN DEFAULT FALSE
);