"use client";

import "@radix-ui/themes/styles.css";
import { useEffect, useState } from "react";
import { Skeleton } from "@radix-ui/themes";
import { Movie } from "@/client";
import MovieCard from "@/components/ui/MovieCard";
import Link from "next/link";

export default function Slideshow({
  movies: moviesProp,
}: {
  movies: Movie[] | null;
}) {
  const [movies, setMovies] = useState<Movie[] | null>([null]);

  const [shownCard, setShownCard] = useState<number>(0);

  useEffect(() => {
    if (moviesProp) {
      setMovies(moviesProp);
    }
  }, [moviesProp]);

  const scroll = (direction) => {
    setShownCard((prevCard) => {
      const next = prevCard + direction;
      if (next < 0 || next >= movies.length) return prevCard;
      return next;
    });
  };

  return (
    <div className={"w-full flex flex-col justify-between relative"}>
      <div className={"w-full"}>
        {movies.map((movie, index) => (
          <div
            key={index}
            id={`slide-${index}`}
            className={shownCard !== index ? "hidden" : ""}
          >
            <SlideshowCard movieData={movie} />
          </div>
        ))}
      </div>
      <div
        className={"absolute w-full flex flex-row justify-between top-1/2 px-7"}
      >
        <button
          className={`${
            shownCard == 0 ? "cursor-not-allowed" : ""
          } text-2xl opacity-50`}
          onClick={() => scroll(-1)}
        >
          {"<"}
        </button>
        <button
          className={`${
            shownCard == movies.length - 1 ? "cursor-not-allowed" : ""
          } text-2xl opacity-50`}
          onClick={() => scroll(1)}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}

function SlideshowCard({ movieData }: { movieData: Movie }) {
  const isLoading = !movieData;

  return (
    <div
      className={
        "relative w-full overflow-hidden h-[55dvh] md:h-[70dvh] lg:h-[70dvh]"
      }
    >
      {!isLoading ? (
        // need to replace trailer_img with trailer_cover when possible
        <img
          src={movieData?.trailer_img}
          alt={movieData?.title}
          className={"object-cover w-full"}
        />
      ) : (
        <Skeleton loading={isLoading}>
          <div className="w-full h-full">&nbsp;</div>
        </Skeleton>
      )}
      <div
        className={
          "w-[80dvw] absolute flex flex-col gap-10 top-1/2 left-1/2 -translate-1/2 md:gap-0 md:flex-row md:justify-between md:items-end md:top-57 md:left-20 md:-translate-0"
        }
      >
        <div className={"m-auto md:m-0"}>
          <MovieCard movieData={movieData} />
        </div>
        <div className={"flex flex-row gap-10"}>
          {movieData ? (
            <>
              <Link className="cursor-pointer" href={`/movies/${movieData.movie_id}`} passHref>
                <Button>Details</Button>
              </Link>
              <Button>Get Tickets</Button>
            </>
          ) : (
            <>
              <Button >Details</Button>
              <Button>Get Tickets</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Button({ children }) {
  return (
    <button
      className={
        "w-[35dvw] py-2 outline-solid text-xl rounded-xs bg-stone-800 text-stone-400 outline-1 hover:bg-stone-700 md:w-[20dvw] py-2 lg:w-[15dvw]"
      }
    >
      {children}
    </button>
  );
}
