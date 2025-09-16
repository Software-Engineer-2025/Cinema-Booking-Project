CREATE TABLE UserProfile (
    user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    isAdmin BOOLEAN DEFAULT FALSE,
    promotional_list BOOLEAN DEFAULT FALSE
);