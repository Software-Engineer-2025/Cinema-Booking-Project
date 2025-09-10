
CREATE TABLE TheaterSection (
    date DATE NOT NULL,
    time TIME NOT NULL,
    screen_number INT NOT NULL,
    name TEXT REFERENCES Theater(name),
    movie_id BIGINT REFERENCES Movie(movie_id),
    PRIMARY KEY (date, time, screen_number, name)
);