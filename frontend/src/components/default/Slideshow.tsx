"use client"

import '@radix-ui/themes/styles.css';
import {useState} from "react";
import {Skeleton} from "@radix-ui/themes";
import Image from "next/image";
import Stars from "@/components/ui/Stars";

export interface MovieData {
    movieId: string | null,
    name: string | null,
    poster: string | null,
    cover: string | null,
    stars: string | null
}

export default function Slideshow() {
    const mockMovie: MovieData = {
        movieId: null,
        name: null,
        poster: null,
        cover: null,
        stars: null
    }
    const [movies, setMovies] = useState<MovieData[] | null>([mockMovie]);

    const [shownCard, setShownCard] = useState<number>(0);

    const scroll = (direction) => {
        setShownCard(prevCard => {
            const next = prevCard + direction;
            if (next < 0 || next >= movies.length) return prevCard;
            return next;
        });
    }

    return(
        <div className={"w-full flex flex-col justify-between relative"}>
            <button className={`${shownCard == 0 ? 'cursor-not-allowed' : ''} absolute -translate-1/2 top-1/2`} onClick={() => scroll(-1)}></button>
            <div className={"w-full"}>
                {movies.map((movie, index) => (
                    <div key={index} id={`slide-${index}`} className={shownCard !== index ? "hidden" : ""}>
                        <SlideshowCard movieData={movie}/>
                    </div>
                ))}
            </div>
            <button className={`${shownCard == movies.length - 1 ? 'cursor-not-allowed' : ''} absolute -translate-1/2 top-1/2`} onClick={() => scroll(1)}></button>`
        </div>
    );
}


function SlideshowCard({ movieData }: { movieData: MovieData }) {
    const isLoading = !movieData.movieId;

    return(
        <div className={"relative w-full overflow-hidden h-[90dvh] md:h-[80dvh] lg:h-[70dvh]"}>
                {movieData.cover ? (
                    <Image
                        src={movieData.cover}
                        alt={movieData.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <Skeleton loading={isLoading}>
                        <div className="w-full h-full">&nbsp;</div>
                    </Skeleton>
                )}
            <div className={"w-[80dvw] absolute flex flex-col justify-between items-end md:flex-row top-57 left-20"}>
                <div className={"flex flex-col gap-1"}>
                        {movieData.poster ? (
                            <Image
                                src={movieData?.poster}
                                alt={movieData?.name}
                                width={180}
                                height={270}
                            />
                        ) : (
                            <Skeleton loading={isLoading}>
                                <div className="w-[180px] h-[270px]">&nbsp;</div>
                            </Skeleton>
                        )}
                    <h2>{movieData.name || "Loading..."}</h2>
                   <Stars numStars={movieData?.stars ? Math.floor(Number(movieData.stars)) : 0}/>
                </div>
                <div className={"flex flex-row gap-10"}>
                        <Button>Details</Button>
                        <Button>Get Tickets</Button>
                </div>
            </div>
        </div>
    );
}

function Button({ children }) {
    return (
        <button className={"w-[12dvw] py-2 outline-solid text-xl rounded-xs bg-stone-800 text-stone-400 outline-1 hover:bg-stone-700"}>{children}</button>
    );
}