import { Movie } from "@/client";
import { Skeleton } from "@radix-ui/themes";
import Stars from "@/components/ui/Stars";
import Link from "next/link";

export default function MovieCard({movieData}: { movieData: Movie }) {
    const isLoading = !(!!movieData);
    const handleClick = () => {/* add routing to movie's page*/
    }

    return (
        <Link href={`/movies/${movieData?.movie_id}`} className={"min-w-[120px] max-w-[180px] flex flex-col justify-center items-center gap-1 hover:opacity-60 flex-shrink-0 block"}>
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
                    <h4 className={"text-center truncate w-full text-xl font-semibold"}>{isLoading ? "Loading..." : movieData?.title}</h4>
                </Skeleton>
                <Stars numStars={movieData?.rating ? Math.floor(Number(movieData?.rating) / 2) : 0}/>

        </Link>

    
    );
}