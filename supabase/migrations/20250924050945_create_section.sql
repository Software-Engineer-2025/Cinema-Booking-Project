CREATE TABLE TheaterSection (
    theater_section_id BIGSERIAL PRIMARY KEY,
    screen_number INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    movie_id BIGINT REFERENCES Movie(movie_id)
    --UNIQUE (screen_number, date, time) Should be unique but removed for now for development ease
);