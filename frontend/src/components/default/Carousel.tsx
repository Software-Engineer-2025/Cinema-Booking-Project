"use client"

import '@radix-ui/themes/styles.css';
import {useState} from "react";
import {Skeleton} from "@radix-ui/themes";
import Image from "next/image";
import Stars from "@/components/ui/Stars";

export interface MovieData {
    movieId: string,
    name: string,
    poster: string,
    stars: number
}

export default function Carousel({ carouselType }: { carouselType: string }) {

    // clear the movies when the new data is brought in
    const CAROUSEL_NAME = `scrollable-carousel-${carouselType}`
    const [movies, setMovies] = useState<MovieData[] | null>(Array(8).fill(null));

    const scrolling = (direction) => {document.getElementById(CAROUSEL_NAME).scrollLeft += (100 * direction)}

    return(
        <div className={"w-full relative flex flex-row content-center justify-center"}>
            <button className={"absolute"} onClick={() => scrolling(-1)}></button>
            <div id={CAROUSEL_NAME} className={"w-[80dvw] flex flex-row justify-evenly w-full overflow-x-scroll no-scrollbar gap-10"}>
                {movies.map((movie, index) => (
                    <MovieCard key={index} movieData={movie}/>
                ))}
            </div>
            <button className={"absolute"} onClick={() => scrolling(1)}></button>
        </div>
    );
}


function MovieCard({movieData}: {movieData: MovieData}) {
    const isLoading = !movieData;
    const handleClick = () => {/* add routing to movie's page*/}

    return(
        <div onClick={handleClick} className={"flex flex-col justify-center items-center gap-1"}>
                {movieData?.poster ? (
                    <Image
                        src={movieData?.poster}
                        alt={movieData?.name}
                        width={150}
                        height={225}
                        className={"hover:opacity-30"}
                    />
                ) : (
                    <Skeleton loading={isLoading}>
                        <div className="w-[150px] h-[225px]">&nbsp;</div>
                    </Skeleton>
                )}
            <Skeleton loading={isLoading}>
                <h4>{movieData?.name ?? "Loading..."}</h4>
            </Skeleton>
            <Skeleton loading={isLoading}>
                <Stars numStars={movieData?.stars ? Math.floor(Number(movieData?.stars)) : 0}/>
            </Skeleton>
        </div>
    );
}