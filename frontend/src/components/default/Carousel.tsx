import {useEffect, useState} from "react";
import MovieCard from "@/components/default/MovieCard";

// make enum for which type of Carousel it is for the filter to grab from the db?

export interface MovieData {
    id: String,
    name: String,
    poster: String,
    stars: number
}

export default function Carousel(carouselType: String) {

    // clear the movies when the new data is brought in
    // replace the data of the cards already created when the data loads and create new cards as needed
    const CAROUSEL_NAME = `scrollable-carousel ${carouselType}`
    const [movies, setMovies] = useState<MovieData[]>(Array(6).fill(null));
    const [movieCards, setMovieCards] = useState<MovieCard[]>(
        movies.map(movie => (
            <MovieCard id={movie.id} name={movie.name} poster={movie.poster} stars={movie.stars}/>
        )));

    useEffect(() => {
        for(let i = movieCards.length; i < movies.length; i++) {
            setMovieCards((prevCards) => [...prevCards,
                <MovieCard id={movies[i].id} name={movies[i].name} poster={movies[i].poster} stars={movies[i].stars}/>]);
        }
    }, [movies]);

    const scrollingLeft = () => {document.getElementById(CAROUSEL_NAME).scrollLeft += 100}
    const scrollingRight = () => {document.getElementById(CAROUSEL_NAME).scrollLeft -= 100}

    return(
        <div className={"w-4/5"}>
            <button className={""} onClick={scrollingLeft}></button>
            <div id={CAROUSEL_NAME} className={"w-full overflow-x-scroll no-scrollbar"}>
                {movieCards}
            </div>
            <button className={""} onClick={scrollingRight}></button>
        </div>
    );
}