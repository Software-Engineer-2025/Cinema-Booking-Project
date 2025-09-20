"use client"

import Carousel from "@/components/default/Carousel";
import Slideshow from "@/components/default/Slideshow";
import { Movie } from "@/client";
import { allMoviesQuery } from "@/lib/utils/queries";
import {useQuery} from "@tanstack/react-query";
import { useMemo } from "react";

export default function Home() {

    const { data: allMovies= []} = useQuery(allMoviesQuery());

    const releasedMovies = useMemo(
        () => allMovies?.filter(movie => movie.released === true) || [],
        [allMovies]
    );

    const unreleasedMovies = useMemo(
        () => allMovies?.filter(movie => movie.released === false) || [],
        [allMovies]
    );

    console.log(unreleasedMovies);

    return (
        <main className={"w-full flex flex-col justify-center items-center gap-4 mb-[10dvh] text-stone-300"}>
            <Slideshow></Slideshow>
            <section className={"w-[90dvw] flex flex-col gap-4"}>
                <h2>Playing Now</h2>
                <Carousel carouselType={"playing-now"} movies={releasedMovies}/>
            </section>
            <section className={"w-[90dvw] flex flex-col gap-4"}>
                <h2>Coming Soon</h2>
                <Carousel carouselType={"coming-soon"} movies={unreleasedMovies}/>
            </section>
        </main>
    );
}