"use client"

import '@radix-ui/themes/styles.css';
import {useEffect, useState} from "react";
import {Skeleton} from "@radix-ui/themes";
import Image from "next/image";
import Stars from "@/components/ui/Stars";
import { Movie } from "@/client";

export default function Carousel({ carouselType, movies: moviesProp }: { carouselType: string, movies: Movie[] }) {

    // clear the movies when the new data is brought in
    const CAROUSEL_NAME = `scrollable-carousel-${carouselType}`;
    const [movies, setMovies] = useState<Movie[]>(Array(8).fill(null));

    useEffect(() => {
        if(moviesProp || moviesProp > 0) {
            console.log("set", CAROUSEL_NAME, "movies");
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


function MovieCard({movieData}: { movieData: Movie }) {
    const isLoading = !movieData;
    const handleClick = () => {/* add routing to movie's page*/
    }

    return (
        <div onClick={handleClick}
             className={"min-w-[120px] max-w-[180px] flex flex-col justify-center items-center gap-1 hover:opacity-30 flex-shrink-0"}>
            {movieData?.trailer_img ? (
                <div className="w-full aspect-[2/3] overflow-hidden rounded">
                    <img
                        src={movieData?.trailer_img}
                        alt={movieData?.title}
                        className={"h-full w-full object-cover"}
                    />
                </div>
            ) : (
                <Skeleton loading={isLoading}>
                    <div className="w-full aspect-[2/3] bg-gray-200 rounded">&nbsp;</div>
                </Skeleton>
            )}
            <Skeleton loading={isLoading}>
                <h4 className={"text-center truncate w-full text-xl font-semibold"}>{movieData?.title ?? "Loading..."}</h4>
            </Skeleton>
            <Skeleton loading={isLoading}>
                <Stars numStars={movieData?.rating ? Math.floor(Number(movieData?.rating) / 2) : 0}/>
            </Skeleton>
        </div>
    );
}