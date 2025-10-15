"use client";

import { Movie } from "@/client";
import { Skeleton } from "@radix-ui/themes";
import Stars from "@/components/ui/Stars";
import Link from "next/link";
import formatShowtime from "@/lib/utils/format_showtimes";

export default function MovieCard({ movieData }: { movieData: Movie }) {
  const isLoading = !!!movieData;

  // Get the showtimes array from the movieData object
  const movieTimes = movieData?.show_times || [];

  // (Future: implement date filtering here)

  return (
    <Link
      href={`/movies/${movieData?.movie_id}`}
      className={
        "min-w-[120px] max-w-[180px] flex flex-col justify-center items-center gap-1 hover:opacity-60 hover:scale-107 flex-shrink-0 group"
      }
    >
      {movieData?.trailer_img ? (
        <div className="w-full relative aspect-[2/3] overflow-hidden rounded hover-trigger">
          <img
            src={movieData?.trailer_img}
            alt={movieData?.title}
            className={"h-full w-full object-cover"}
          />
          {/* shows all of the movie showtimes when the card is hovered over. */}
          <div
            className={
              "hidden absolute inset-0 bg-stone-900 opacity-80 p-2 flex flex-wrap flex-col flex-start overflow-hidden overflow-y-auto group-hover:block"
            }
          >
            {movieTimes.length > 0 ? (
              movieTimes.map((timestamp: string, index) => (
                <ShowtimeCard key={index}>
                  {}
                  {formatShowtime(timestamp, {
                    showDate: false,
                    showTime: true,
                  })}
                </ShowtimeCard>
              ))
            ) : (
              <span className="text-stone-300 text-sm p-1">
                No times available
              </span>
            )}
          </div>
        </div>
      ) : (
        <Skeleton loading={isLoading}>
          <div className="w-full aspect-[2/3] bg-gray-200 rounded">&nbsp;</div>
        </Skeleton>
      )}
      <Skeleton loading={isLoading}>
        <h4 className={"text-center truncate w-full text-xl font-semibold"}>
          {isLoading ? "Loading..." : movieData?.title}
        </h4>
      </Skeleton>
      <Stars
        numStars={
          movieData?.rating ? Math.floor(Number(movieData?.rating) / 2) : 0
        }
      />
    </Link>
  );
}

// The mini element that shows a individual showtime for a movie.
function ShowtimeCard({ children }) {
  return (
    <span
      className={
        "inline-block bg-stone-700 text-stone-300 rounded-full px-2 py-1 text-sm whitespace-nowrap mr-2 mb-2 no-scrollbar"
      }
    >
      {children}
    </span>
  );
}
