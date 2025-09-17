CREATE TABLE TheaterSection (
    theater_section_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    screen_number INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    movie_id BIGINT REFERENCES Movie(movie_id) 
);