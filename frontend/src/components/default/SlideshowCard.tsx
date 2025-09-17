import MovieData from "@/components/default/Slideshow";
import {Skeleton} from "@radix-ui/themes";
import Stars from "@/components/ui/Stars";
import Image from "next/image";

export default function SlideshowCard(movieData: MovieData) {
    return(
        <div className={"relative"}>
            <Skeleton loading={!(!!movieData)}><Image></Image></Skeleton>
            {/* Make everything below absolute and move it to where it needs to be with flex*/}
            <div className={"flex flex-col justify-between md: flex-row"}>
                <div className={"flex flex-col"}>
                    <Skeleton loading={!(!!movieData)}><Image>{movieData.poster}</Image></Skeleton>
                    <Skeleton loading={!(!!movieData)}><h2>{movieData.name}</h2></Skeleton>
                    <Skeleton loading={!(!!movieData)}><Stars
                        numStars={movieData.stars ? movieData.stars : 0}/></Skeleton>
                </div>
                <div className={"flex flex-row"}>
                    <Skeleton loading={!(!!movieData)}>
                        <button></button>
                    </Skeleton>
                    <Skeleton loading={!(!!movieData)}>
                        <button></button>
                    </Skeleton>
                </div>
            </div>
        </div>
    );
}