"use client";

import Carousel from "@/components/default/Carousel";
import Slideshow from "@/components/default/Slideshow";
import { allMoviesQuery } from "@/lib/utils/queries";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Movie } from "@/client";

export default function Home() {
  const { data: allMovies = [] } = useQuery(allMoviesQuery());

  // Sets first 4 movies from all movie, will be updated when featured is added to DB and seed data is updated.
  const featuredMovies = useMemo(
    () => allMovies?.slice(0, 4) || null,
    [allMovies]
  );

  // An array filtered from all movies to those that are released.
  const releasedMovies = useMemo(
    () => allMovies?.filter((movie) => movie.released === true) || [],
    [allMovies]
  );

  // An array filtered from all movies to those that are unreleased.
  const unreleasedMovies = useMemo(
    () => allMovies?.filter((movie) => movie.released === false) || [],
    [allMovies]
  );

  return (
    <main
      className={
        "w-full flex flex-col justify-center items-center gap-4 mb-[10dvh] text-stone-300"
      }
    >
      <Slideshow movies={featuredMovies}></Slideshow>
      <section className={"w-[90dvw] flex flex-col gap-4"}>
        <h2>Currently Running</h2>
        <Carousel carouselType={"playing-now"} movies={releasedMovies} />
      </section>
      <section className={"w-[90dvw] flex flex-col gap-4"}>
        <h2>Coming Soon</h2>
        <Carousel carouselType={"coming-soon"} movies={unreleasedMovies} />
      </section>
    </main>
  );
}