CREATE TABLE Movie (
    movie_id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    release_date DATE,
    genre TEXT,
    director TEXT,
    cast_list TEXT[],
    rating DECIMAL,
    producer TEXT,
    synopsis TEXT,
    reviews TEXT[],
    trailer_img TEXT,
    trailer_video TEXT,
    MPAA_rating TEXT,
    show_times TIMESTAMP[],
    released BOOLEAN DEFAULT FALSE
);