CREATE TABLE Ticket (
    ticket_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES UserProfile(user_id) DEFAULT NULL,
    seat TEXT NOT NULL,
    is_taken BOOLEAN DEFAULT FALSE,
    price DOUBLE PRECISION NOT NULL,
    status TEXT DEFAULT 'open',
    theater_section_id BIGINT REFERENCES TheaterSection(theater_section_id)
);