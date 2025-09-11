CREATE TABLE Ticket (
    ticket_id UUID PRIMARY KEY,
    seat TEXT,
    is_taken BOOLEAN DEFAULT FALSE,
    price DOUBLE PRECISION NOT NULL,
    status TEXT DEFAULT 'open',
    user_id UUID REFERENCES UserProfile(user_id) DEFAULT NULL,
    theater_section_id UUID REFERENCES TheaterSection(theater_section_id)

);