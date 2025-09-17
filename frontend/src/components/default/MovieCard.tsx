import { Skeleton } from "@radix-ui/themes";
import Image from "next/image";
import Stars from "@/components/ui/Stars";
import { MovieData } from "@/components/default/Carousel";

export default function MovieCard(movieData: MovieData) {

    const handleClick = () => {/* add routing to movie's page*/}

    return(
        <div onClick={handleClick}>
            <Skeleton loading={!(!!movieData)}>
                <Image src={movieData.poster} alt={`${movieData.name} poster`}/>
            </Skeleton>
            <Skeleton leading={!(!!movieData)}>
                <h4>{movieData.name}</h4>
            </Skeleton>
            <Skeleton loading={!(!!movieData)}>
                <Stars numStars={movieData.stars ? movieData.stars : 0}/>
            </Skeleton>
        </div>
    );
}