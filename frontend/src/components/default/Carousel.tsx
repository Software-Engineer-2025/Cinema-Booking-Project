"use client"

import '@radix-ui/themes/styles.css';
import {useEffect, useState} from "react";
import { Movie } from "@/client";
import MovieCard from "@/components/ui/MovieCard";

export default function Carousel({ carouselType, movies: moviesProp }: { carouselType: string, movies: Movie[] | null}) {

    // clear the movies when the new data is brought in
    const CAROUSEL_NAME = `scrollable-carousel-${carouselType}`;
    const [movies, setMovies] = useState<Movie[]>(Array(8).fill(null));

    useEffect(() => {
        if(moviesProp && moviesProp.length != 0) {
            setMovies(moviesProp);
        }
    }, [moviesProp]);

    const scrolling = (direction: number) => {
        const elem = document.getElementById(CAROUSEL_NAME);
        if (elem) {
            elem.scrollLeft += (600 * direction);
        }
    }

    return (
        <div className={"w-full relative"}>
            <div className={"w-full flex flex-row content-center justify-center gap-8"}>
                <button className={"hidden md:block text-4xl opacity-50 hover:opacity-30"} onClick={() => scrolling(-1)}>{"<"}</button>
                <div id={CAROUSEL_NAME}
                     className={"w-[80dvw] h-[40dvh] flex flex-row justify-evenly overflow-x-scroll no-scrollbar gap-10"}>
                    {movies.map((movie, index) => (
                            <MovieCard key={index} movieData={movie}/>

                    ))}
                </div>
                <button className={"hidden md:block text-4xl opacity-50 hover:opacity-30"} onClick={() => scrolling(1)}>{">"}</button>
            </div>
        </div>
    );
}