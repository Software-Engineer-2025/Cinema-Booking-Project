"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useMemo, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "sonner";

import DefaultDropdown from "@/components/ui/DefaultDropdown";
import TicketCounter from "@/components/default/TicketCounter";
import Button from "@/components/ui/Button";
import Showtimes from "@/components/dashboard/Showtimes";

import { Movie } from "@/client";
import { allMoviesQuery } from "@/lib/utils/queries";

export default function BookPage() {
  const [selectedShowtime, setSelectedShowtime] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const movieIdFromUrl = searchParams.get("movieId");
  const showtimeFromUrl = searchParams.get("showtime");

  const [adultTickets, setAdultTickets] = useState<number>(0);
  const [childTickets, setChildTickets] = useState<number>(0);
  const [seniorTickets, setSeniorTickets] = useState<number>(0);
  const adultTicketsFromUrl = searchParams.get("adultTickets");
  const childTicketsFromUrl = searchParams.get("childTickets");
  const seniorTicketsFromUrl = searchParams.get("seniorTickets");

  const router = useRouter();

  const { data: allMovies = [] } = useQuery(allMoviesQuery());

  const releasedMovies = useMemo(
    () => allMovies?.filter((movie: Movie) => movie.released === true) || [],
    [allMovies]
  );

  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const [totals, setTotals] = useState<{ [key: string]: number }>({});

  // Auto-select movie from URL parameter
  useEffect(() => {
    if (movieIdFromUrl && releasedMovies.length > 0) {
      const movieToSelect = releasedMovies.find(
        (movie) => movie.movie_id === Number(movieIdFromUrl)
      );
      if (movieToSelect) {
        setSelectedMovie(movieToSelect);
      }
    }
  }, [movieIdFromUrl, releasedMovies]);

  // Auto-select showtime from URL parameter
  useEffect(() => {
    if (showtimeFromUrl) {
      setSelectedShowtime(decodeURIComponent(showtimeFromUrl));
    }
  }, [showtimeFromUrl]);

  // Auto-select adult tickets from URL parameter
  useEffect(() => {
    if (adultTicketsFromUrl) {
      setAdultTickets(Number(adultTicketsFromUrl));
    }
  }, [adultTicketsFromUrl]);

  // Auto-select child tickets from URL parameter
  useEffect(() => {
    if (childTicketsFromUrl) {
      setChildTickets(Number(childTicketsFromUrl));
    }
  }, [childTicketsFromUrl]);

  // Auto-select senior tickets from URL parameter
  useEffect(() => {
    if (seniorTicketsFromUrl) {
      setSeniorTickets(Number(seniorTicketsFromUrl));
    }
  }, [seniorTicketsFromUrl]);

  const handleChange = useCallback((label: string, subtotal: number) => {
    setTotals((prev) => ({ ...prev, [label]: subtotal }));
  }, []);

  const totalPrice = Object.values(totals).reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-screen-xl mx-auto px-4 text-white flex flex-col lg:pt-10">
      {/* Top Section (Book Tickets header with back and close buttons) */}
      <div className="flex justify-between items-center border-b">
        <div className="flex items-center gap-8">
          <button onClick={() => router.back()}>
            <svg
              width="30"
              height="30"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94628 8.84182 3.13514Z"
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h2>Book Tickets</h2>
        </div>

        <Link href="/">
          <svg
            width="25"
            height="25"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.8536 2.85355C13.0488 2.65829 13.0488 2.34171 12.8536 2.14645C12.6583 1.95118 12.3417 1.95118 12.1464 2.14645L7.5 6.79289L2.85355 2.14645C2.65829 1.95118 2.34171 1.95118 2.14645 2.14645C1.95118 2.34171 1.95118 2.65829 2.14645 2.85355L6.79289 7.5L2.14645 12.1464C1.95118 12.3417 1.95118 12.6583 2.14645 12.8536C2.34171 13.0488 2.65829 13.0488 2.85355 12.8536L7.5 8.20711L12.1464 12.8536C12.3417 13.0488 12.6583 13.0488 12.8536 12.8536C13.0488 12.6583 13.0488 12.3417 12.8536 12.1464L8.20711 7.5L12.8536 2.85355Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      {/* Bottom Section */}
      <div className=" flex flex-col justify-between lg:flex-row gap-12 py-10">
        {/* Left Section: Movie + Showtimes */}
        <div className=" w-full flex flex-col gap-10 mx-auto">
          {/* Dropdown for released movies */}
          <DefaultDropdown
            label={selectedMovie ? selectedMovie.title : "Select Movie"}
            onSelect={(title) => {
              const movie = releasedMovies.find((m) => m.title === title);
              setSelectedMovie(movie || null);
              setSelectedShowtime(null); // reset when movie changes
            }}
          >
            {releasedMovies.map((movie: Movie, index) => (
              <button key={`movie-${movie.movie_id}-${index}`}>
                {movie.title}
              </button>
            ))}
          </DefaultDropdown>

          {/* Showtimes (only if a movie is selected) */}
          {selectedMovie ? (
            <Showtimes
              movieData={selectedMovie}
              selectedShowtime={selectedShowtime}
              onSelectShowtime={(time) => setSelectedShowtime(time)}
            />
          ) : (
            <p className="text-white">Select a movie to view showtimes</p>
          )}
        </div>

        {/* Right Section: Tickets */}
        <div className=" flex flex-col w-full mx-auto gap-5">
          <h2>Select Tickets</h2>
          <div className="flex flex-col gap-4">
            <TicketCounter
              label="Adult"
              price={12}
              amount={adultTickets}
              setAmount={setAdultTickets}
              onChange={handleChange}
            />
            <TicketCounter
              label="Child"
              price={8}
              amount={childTickets}
              setAmount={setChildTickets}
              onChange={handleChange}
            />
            <TicketCounter
              label="Senior"
              price={10}
              amount={seniorTickets}
              setAmount={setSeniorTickets}
              onChange={handleChange}
            />
          </div>
          <div className="flex justify-between items-center px-3">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
          </div>
          <Button
            className="text-black bg-gray-300/50 rounded-md py-4"
            onClick={() => {
              const totalTickets = adultTickets + childTickets + seniorTickets;
              if (!selectedMovie) {
                toast.error("Select a movie before continuing.");
                return;
              }
              if (!selectedShowtime) {
                toast.error("Select a showtime before continuing.");
                return;
              }
              if (totalTickets <= 0) {
                toast.error("Choose at least one ticket to continue.");
                return;
              }

              router.push(
                `/select-seats?movieId=${
                  selectedMovie.movie_id
                }&showtime=${encodeURIComponent(
                  selectedShowtime
                )}&adultTickets=${adultTickets}&childTickets=${childTickets}&seniorTickets=${seniorTickets}`
              );
            }}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
