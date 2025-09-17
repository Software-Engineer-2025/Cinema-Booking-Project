-- Disable RLS for seeding


INSERT INTO "movie" (
    title,
    release_date,
    genre,
    director,
    cast_list,
    rating,
    producer,
    synopsis,
    reviews,
    trailer_img,
    trailer_video,
    MPAA_rating,
    show_times,
    released
) VALUES
(
    'Superman (2025)',
    '2025-07-11',
    'Action, Sci-Fi',
    'James Gunn',
    ARRAY['David Corenswet', 'Rachel Brosnahan', 'Nicholas Hoult'],
    7.2,
    'James Gunn',
    'Superman must reconcile his alien Kryptonian heritage with his human upbringing as reporter Clark Kent.',
    ARRAY['A fresh, hopeful tone.', 'Pacing issues.'],
    '/images/Superman.png',
    'https://www.youtube.com/embed/Way9Dexny3w',
    'PG-13',
    ARRAY['2025-10-01 18:00:00'::timestamp, '2025-10-01 21:00:00'::timestamp],
    TRUE
),
(
    'The Conjuring: Last Rites',
    '2025-09-05',
    'Supernatural Horror, Mystery, Thriller',
    'Michael Chaves',
    ARRAY['Patrick Wilson', 'Vera Farmiga', 'Mia Tomlinson'],
    6.5,
    'James Wan',
    'Paranormal investigators Ed and Lorraine Warren take on one last terrifying case.',
    ARRAY['Needed more horror in it.', 'Slow burn to nothingness.'],
    '/images/conjuring.png',
    'https://www.youtube.com/embed/placeholder-lastrites',
    'R',
    ARRAY['2025-09-05 19:00:00'::timestamp, '2025-09-06 22:00:00'::timestamp],
    TRUE
),
(
    'Downton Abbey: The Grand Finale',
    '2025-09-12',
    'Drama',
    'Simon Curtis',
    ARRAY['Michelle Dockery', 'Joanne Froggatt', 'Elizabeth McGovern'],
    7.8,
    'Julian Fellowes',
    'The Crawleys must embrace change with the next generation leading Downton Abbey into the future.',
    ARRAY['A perfect way to end a show.', 'It tied up a great deal of stories.'],
    '/images/downtownAbbey.png',
    'https://www.youtube.com/embed/P_30wFRxlnA',
    'PG',
    ARRAY['2025-09-12 18:00:00'::timestamp, '2025-09-13 21:00:00'::timestamp],
    TRUE
),
(
    'F1: The Movie',
    '2025-06-27',
    'Action, Sport, Drama',
    'Joseph Kosinski',
    ARRAY['Brad Pitt', 'Damson Idris', 'Javier Bardem'],
    7.8,
    'Jerry Bruckheimer',
    'A Formula One driver comes out of retirement to mentor a younger driver.',
    ARRAY['Incredible action and cinematography.'],
    '/images/f1.png',
    'https://www.youtube.com/embed/placeholder-f1',
    'PG-13',
    ARRAY['2025-06-27 18:00:00'::timestamp, '2025-06-28 20:30:00'::timestamp],
    TRUE
),
(
    'Freakier Friday',
    '2025-08-08',
    'Comedy, Family, Fantasy',
    'Nisha Ganatra',
    ARRAY['Jamie Lee Curtis', 'Lindsay Lohan', 'Julia Butters'],
    6.9,
    'Mary Rodgers',
    '22 years after Tess and Anna endured an identity crisis, lightning might strike twice.',
    ARRAY['A movie for the millennials.', 'I Enjoyed It.'],
    '/images/freakierFriday.png',
    'https://www.youtube.com/embed/placeholder-freakier',
    'PG',
    ARRAY['2025-08-08 18:00:00'::timestamp, '2025-08-09 20:30:00'::timestamp],
    TRUE
),
(
    'Light of the World',
    '2025-09-05',
    'Animation, Drama, Family',
    'Tom Bancroft, John J. Schafer',
    ARRAY['Ian Hanlin', 'Benjamin Jacobson', 'Michael Benyaer'],
    6.6,
    'Brennan McPherson',
    'Follows Jesus''s life from ministry beginnings through crucifixion and resurrection.',
    ARRAY['Beautiful Movie about our Savior.', 'Solid movie.'],
    '/images/lightOfTheWorld.png',
    'https://www.youtube.com/embed/h3cgIg1bxAk',
    'PG',
    ARRAY['2025-09-05 16:00:00'::timestamp, '2025-09-06 19:00:00'::timestamp],
    TRUE
);

-- Insert theaters
INSERT INTO "theater" (name, address)
VALUES
    ('A-List Cinemas', '123 Main St, Anytown'),
    ('The Grand Theatre', '456 Oak Ave, Anytown');

-- Insert theater sections referencing movies seeded above
INSERT INTO "theatersection" (date, time, screen_number, movie_id)
VALUES
    ('2025-09-20', '19:00:00', 1,  (SELECT movie_id FROM "movie" WHERE title = 'Superman (2025)')),
    ('2025-09-20', '21:00:00', 1,  (SELECT movie_id FROM "movie" WHERE title = 'F1: The Movie')),
    ('2025-09-21', '18:30:00', 2, (SELECT movie_id FROM "movie" WHERE title = 'Downton Abbey: The Grand Finale'));

-- Insert sample users
--temporary and gets around auth
ALTER TABLE "userprofile" DROP CONSTRAINT "userprofile_user_id_fkey";


INSERT INTO "userprofile" (user_id, first_name, last_name, promotional_list)
VALUES
    ('8c3aab77-061b-4f77-a24a-4b4957712ead', 'Jane', 'Doe',  TRUE),
    ('7db1fcf4-c97f-40f1-8b61-a1e371793a8b', 'John', 'Smith',  FALSE);

