CREATE TABLE Theater (
    name TEXT PRIMARY KEY,
    address TEXT NOT NULL
);

-- Many-to-many relationship: Movie <-> Theater
CREATE TABLE MovieTheater (
    movie_id BIGINT REFERENCES Movie(movie_id),
    theater_name TEXT REFERENCES Theater(name),
    PRIMARY KEY (movie_id, theater_name)
);