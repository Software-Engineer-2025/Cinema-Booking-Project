"use client";
import formatShowtime from "@/lib/utils/format_showtimes";
import { useRouter, usePathname } from "next/navigation";

export default function Showtimes({
  movieData,
  selectedShowtime,
  onSelectShowtime,
}: {
  movieData: any;
  selectedShowtime?: string | null;
  onSelectShowtime?: (time: string) => void;
}) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Check if we're on the movie details page (not booking page)
  const isMovieDetailsPage = pathname.includes('/movies/');

  const handleShowtimeClick = (timestamp: string) => {
    if (isMovieDetailsPage) {
      // Navigate to booking page with movie and showtime pre slected
      router.push(`/book?movieId=${movieData.movie_id}&showtime=${encodeURIComponent(timestamp)}`);
    } else {
      // We're on booking page, just call the callback
      onSelectShowtime?.(timestamp);
    }
  };

  // Early return if movieData is not loaded yet
  if (!movieData || !movieData.show_times || !Array.isArray(movieData.show_times)) {
    return (
      <div className="flex flex-col w-full lg:w-1/2 gap-4">
        <h2 className="text-white font-medium">Showtimes</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col py-4 gap-2">
            <p className="text-white text-sm">Loading showtimes...</p>
          </div>
        </div>
      </div>
    );
  }

  // Check if there are no showtimes
  if (movieData.show_times.length === 0) {
    return (
      <div className="flex flex-col w-full lg:w-1/2 gap-4">
        <h2 className="text-white font-medium">Showtimes</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col py-4 gap-2">
            <p className="text-white text-sm">No showtimes available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white flex flex-col w-full lg:w-1/2 gap-4">
      <h2 className="text-white font-medium">Showtimes</h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col py-4 gap-2">
          <h3 className="font-bold">
            {formatShowtime(movieData.show_times[0], {
              showDate: true,
              showTime: false,
            })}
          </h3>
          <div className="flex flex-wrap gap-x-4 gap-y-4 py-2 max-w-md">
            {movieData.show_times.map((timestamp: string, index: number) => {
              const isSelected = selectedShowtime === timestamp;
              return (
                <button
                  key={`${timestamp}-${index}`}
                  className={`rounded-full bg-black/5 border px-6 py-2 text-sm sm:text-base font-special
                    ${
                      isSelected
                        ? "bg-white/20 text-white"
                        : "text-white hover:text-gray-400"
                    }
                    hover:cursor-pointer transition`}
                  type="button"
                  onClick={() => handleShowtimeClick(timestamp)}
                >
                  {formatShowtime(timestamp, {
                    showDate: false,
                    showTime: true,
                  })}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}