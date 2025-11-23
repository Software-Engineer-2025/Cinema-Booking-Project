CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- CREATE EXTENSION IF NOT EXISTS vault WITH SCHEMA vault;


-- Movie has no dependencies, so it's created first.
CREATE TABLE movie (
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
    duration INT NOT NULL,
    released BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE
);

-- Price has no dependencies
CREATE TABLE price (
    price_id BIGINT PRIMARY KEY,
    price_name TEXT NOT NULL,
    amount DECIMAL
);

-- UserProfile had no dependency
CREATE TABLE userprofile (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    address_line_1 TEXT,
    address_line_2 TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    country TEXT,
    is_admin BOOLEAN DEFAULT FALSE,
    promotion BOOLEAN DEFAULT FALSE,
    phone TEXT
);

-- Showroom depends on nothing, so it's created early.
CREATE TABLE showroom (
    showroom_id BIGINT PRIMARY KEY,
    capacity INT NOT NULL
);

-- Seat depends on Showroom.
CREATE TABLE seat (
    seat_id BIGINT PRIMARY KEY,
    row_letter CHAR(1) NOT NULL,
    column_number INT NOT NULL,
    showroom_id BIGINT REFERENCES Showroom(showroom_id),
    UNIQUE (showroom_id, row_letter, column_number)
);

-- Show depends on Movie and Showroom.
CREATE TABLE show(
    show_id BIGINT PRIMARY KEY,
    movie_id BIGINT REFERENCES movie(movie_id) ON DELETE CASCADE,
    showroom_id BIGINT REFERENCES Showroom(showroom_id),
    date DATE NOT NULL,
    time TIME NOT NULL
);


-- Booking is dependent on user and show. It must be made before ticket
CREATE TABLE booking (
    booking_id BIGSERIAL PRIMARY KEY,
    user_id UUID REFERENCES UserProfile(user_id) ON DELETE CASCADE,
    show_id BIGINT REFERENCES Show(show_id),
    booking_date TIMESTAMPTZ DEFAULT NOW(),
    total_amount DOUBLE PRECISION NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed',
    CONSTRAINT valid_status CHECK (status IN ('confirmed', 'cancelled', 'pending'))
);

-- Ticket depends on Booking, Show, and Seat.
CREATE TABLE ticket (
    ticket_id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL REFERENCES booking(booking_id) ON DELETE CASCADE,
    seat_id BIGINT NOT NULL REFERENCES Seat(seat_id),
    show_id BIGINT NOT NULL REFERENCES Show(show_id),
    ticket_type TEXT NOT NULL DEFAULT 'adult',
    price DOUBLE PRECISION NOT NULL,
    CONSTRAINT valid_ticket_type CHECK (ticket_type IN ('adult', 'child', 'senior')),
    UNIQUE (seat_id, show_id)
);

CREATE TABLE genre (
    genre_id BIGINT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- MovieGenre join table, for many-to-many relationship
CREATE TABLE moviegenre (
    movie_id BIGINT REFERENCES Movie(movie_id),
    genre_id BIGINT REFERENCES Genre(genre_id),
    PRIMARY KEY (movie_id, genre_id)
);

CREATE TABLE paymentcards (
    card_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    card_details BYTEA NOT NULL,
    card_last_four VARCHAR(4) NOT NULL,
    card_brand TEXT,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE promotion (
    promotion_id BIGINT PRIMARY KEY,
    promo_code TEXT NOT NULL UNIQUE,
    discount DECIMAL NOT NULL,
    start_date DATE,
    end_date DATE
);
