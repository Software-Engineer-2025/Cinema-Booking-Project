import {useEffect, useState} from "react";
import SlideshowCard from "@/components/default/SlideshowCard";

export interface MovieData {
    id: String,
    name: String,
    poster: String,
    cover: String,
    stars: number
}

export default function Slideshow() {

    const [movies, setMovies] = useState<MovieData[]>(Array(4).fill(null));
    const [slideCards, setSlideCards] = useState<SlideshowCard[]>(
        movies.map(movie => (
            <SlideshowCard id={movie.id} name={movie.name} poster={movie.poster} cover={movie.cover} stars={movie.stars}/>
        )));
    const [shownCard, setShownCard] = useState<number>(0);
    const [leftHidden, setLeftHidden] = useState<boolean>(true);
    const [rightHidden, setRightHidden] = useState<boolean>(false);

    useEffect(() => {
        if(shownCard == 0) {
            setLeftHidden(true);
        } else if (shownCard == 4) {
            setRightHidden(true);
        } else {
            setLeftHidden(false);
            setRightHidden(false);
        }
    }, [shownCard]);

    const scrollingLeft = () => {
        setShownCard(shownCard - 1);
    }
    const scrollingRight = () => {
        setShownCard(shownCard + 1);
    }

    return(
        <div className={"w-4/5 relative"}>
            <button className={`${leftHidden ? 'none' : 'inline-block'} absolute -translate-1/2 top-1/2`} onClick={scrollingLeft}></button>
            <div className={"w-full"}>
                {slideCards[shownCard]}
            </div>
            <button className={`${rightHidden ? 'none' : 'inline-block'} absolute -translate-1/2 top-1/2`} onClick={scrollingRight}></button>`
        </div>
    );
}