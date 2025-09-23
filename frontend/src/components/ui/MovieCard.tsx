import { Movie } from "@/client";
import { Skeleton } from "@radix-ui/themes";
import Stars from "@/components/ui/Stars";

export default function MovieCard({movieData}: { movieData: Movie }) {
    const isLoading = !(!!movieData);
    const movieTimes = ["1:00pm", "4:30pm", "6:00pm", "7:30pm", "9:00pm", "10:30pm"]

    const handleClick = () => {/* add routing to movie's page*/
    }

    return (
        <div onClick={handleClick}
             className={"min-w-[120px] max-w-[180px] flex flex-col justify-center items-center gap-1 hover:opacity-60 flex-shrink-0 group"}>
            {movieData?.trailer_img ? (
                <div className="w-full relative aspect-[2/3] overflow-hidden rounded hover-trigger">
                    <img
                        src={movieData?.trailer_img}
                        alt={movieData?.title}
                        className={"h-full w-full object-cover"}
                    />
                    <div className={"hidden absolute inset-0 bg-stone-900 opacity-80 p-2 flex flex-wrap flex-col flex-start overflow-hidden overflow-y-auto group-hover:block"}>
                        {movieTimes.map((movieTime, index) => (
                            <ShowtimeCard key={index}>{movieTime}</ShowtimeCard>
                        ))}
                    </div>
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
        </div>
    );
}

function ShowtimeCard({ children }) {
    return(
        <span className={"inline-block bg-stone-700 text-stone-300 rounded-full px-2 py-1 text-lg whitespace-nowrap mr-2 mb-2 no-scrollbar"}>{children}</span>
    );
}