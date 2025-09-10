CREATE TABLE Ticket (
    ticket_id UUID PRIMARY KEY,
    user_id UUID REFERENCES UserProfile(user_id) DEFAULT NULL,
    seat TEXT NOT NULL,
    is_taken BOOLEAN NOT NULL,
    theater_section_date DATE NOT NULL,
    theater_section_time TIME NOT NULL,
    theater_section_screen_number INT NOT NULL,
    theater_section_name TEXT NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    FOREIGN KEY (theater_section_date, theater_section_time, theater_section_screen_number, theater_section_name)
        REFERENCES TheaterSection(date, time, screen_number, name)
);