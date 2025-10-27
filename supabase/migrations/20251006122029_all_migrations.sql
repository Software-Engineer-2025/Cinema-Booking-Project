-- CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;
-- CREATE EXTENSION IF NOT EXISTS vault WITH SCHEMA vault;


-- Movie has no dependencies, so it's created first.
CREATE TABLE Movie (
    movie_id BIGINT PRIMARY KEY,
    title TEXT NOT NULL,
    release_date DATE,
    director TEXT,
    cast_list TEXT,
    rating DECIMAL,
    producer TEXT,
    synopsis TEXT,
    reviews TEXT,
    trailer_img TEXT,
    trailer_video TEXT,
    mpaa_rating TEXT,
    released BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE
);

-- UserProfile had no dependency
CREATE TABLE UserProfile (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    promotional_list BOOLEAN DEFAULT FALSE
);

-- Showroom depends on nothing, so it's created early.
CREATE TABLE Showroom (
    showroom_id BIGINT PRIMARY KEY,
    capacity INT NOT NULL
);

-- Seat depends on Showroom.
CREATE TABLE Seat (
    seat_id BIGINT PRIMARY KEY,
    row_letter CHAR(1) NOT NULL,
    column_number INT NOT NULL,
    showroom_id BIGINT REFERENCES Showroom(showroom_id),
    UNIQUE (showroom_id, row_letter, column_number)
);

-- Show depends on Movie and Showroom.
CREATE TABLE Show(
    show_id BIGINT PRIMARY KEY,
    movie_id BIGINT REFERENCES Movie(movie_id),
    showroom_id BIGINT REFERENCES Showroom(showroom_id),
    date DATE NOT NULL,
    time TIME NOT NULL,
    UNIQUE (showroom_id, date, time)
); 

-- Ticket depends on UserProfile, Show, and Seat.
CREATE TABLE Ticket (
    ticket_id BIGINT PRIMARY KEY,
    user_id UUID REFERENCES UserProfile(user_id) DEFAULT NULL, 
    price DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL DEFAULT 'reserved',
    seat_id BIGINT REFERENCES Seat(seat_id),
    show_id BIGINT REFERENCES Show(show_id)
);

CREATE TABLE Genre (
    genre_id BIGINT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- MovieGenre join table, for many-to-many relationship
CREATE TABLE MovieGenre (
    movie_id BIGINT REFERENCES Movie(movie_id),
    genre_id BIGINT REFERENCES Genre(genre_id),
    PRIMARY KEY (movie_id, genre_id)
);

CREATE TABLE PaymentCards (
    card_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_details BYTEA NOT NULL,
    card_last_four VARCHAR(4) NOT NULL,
    card_brand TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

