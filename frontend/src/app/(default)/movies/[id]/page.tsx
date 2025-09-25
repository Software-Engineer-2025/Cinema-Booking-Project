"use client";

import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";           
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { allMoviesQuery } from "@/lib/utils/queries";
import { Movie } from "@/client";

export default function MoviePage() {
    const { id } = useParams();
    const { data: allMovies = [], isLoading } = useQuery(allMoviesQuery());

    const movieData: Movie | undefined = allMovies.find(
        (m) => m.movie_id === Number(id)
    );

    if (isLoading) return <p className="text-white">Loading...</p>;
    if (!movieData) return <p className="text-white">Movie not found</p>;

    // Convert rating from 0-10 scale to 0-5 stars
    const starCount = Math.round(Number(movieData.rating ?? 0) / 2);
    
    // Handle creators (director and producer)
    const creators = [movieData.director, movieData.producer]
        .filter(Boolean)
        .join(", ");
    
    // Handle cast_list array
    const cast = Array.isArray(movieData.cast_list) 
        ? movieData.cast_list.join(", ") 
        : "";
    
    const genre = movieData.genre ?? "";
    const mpaa = movieData.mpaa_rating ?? "";

    // Format showtimes from timestamp array
    const formatShowtime = (timestamp: string | Date) => {
        try {
            const date = new Date(timestamp);
            return date.toLocaleTimeString('en-US', { 
                hour: "2-digit", 
                minute: "2-digit"
            });
        } catch {
            return "Invalid time";
        }
    };

    return (
        // main container 
        <div className="flex-col gap-12 px-4 lg:max-w-[1400px] mx-auto sm:px-6 md:px-12 sm:py-8 md:py-25 justify-center lg:min-w-[900px]">
          
          {/* Movie Info (top info)*/}
          <div className="flex flex-col lg:flex-row justify-center gap-8 lg:gap-16 lg:pb-10">
            
            {/* Left Movie Info (Poster + Title + Rating) */}
            <div className="px-3 flex flex-col gap-6 w-full lg:w-96 lg:flex-shrink-0 items-start lg:items-start">
              {/* poster */}
              <div className="relative w-full max-w-xs aspect-[2/3]">
                <img
                  src={movieData.trailer_img}
                  alt={`${movieData.title} Poster`}
                  className="w-full h-full rounded-xl shadow-lg object-cover"
                />
              </div>
              {/* title */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl text-white uppercase py-4 sm:py-2 break-words leading-tight">
                {movieData.title}
              </h1>
              {/* Rating */}
              <div className="flex" role="img" aria-label={`Rating: ${starCount} out of 5 stars`}>
                {Array.from({ length: 5 }, (_, i) => (
                  i < starCount ? (
                    <StarFilledIcon key={i} className="w-6 h-6 text-white" />
                  ) : (
                    <StarIcon key={i} className="w-6 h-6 text-white" />
                  )
                ))}
              </div>
            </div>

            {/* Right Movie Info (Description + Grid) */}
            <div className="py-4 sm:py-6 w-full lg:flex-1 px-4 sm:px-6 md:px-10 gap-9 flex flex-col">
              <h2 className="text-white w-full border-b border-white font-medium">Description</h2>

              <div>
                <h3 className="text-white uppercase font-bold font-body">Synopsis</h3>
                <p className="text-white text-sm sm:text-base md:text-base">
                  {movieData.synopsis}
                </p>
              </div>

              <div className="grid gap-y-8 grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col space-y-1">
                  <h3 className="text-white uppercase font-bold font-body">Rating</h3>
                  <p className="text-white font-bold font-special text-2xl sm:text-3xl border w-fit px-4 py-1">
                    {mpaa}
                  </p>
                </div>
                <div className="flex flex-col space-y-1">
                  <h3 className="text-white uppercase font-bold font-body">Category</h3>
                  <p className="text-white text-sm sm:text-base">{genre}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <h3 className="text-white uppercase font-bold font-body">Creators</h3>
                  <p className="text-white text-sm sm:text-base">{creators}</p>
                </div>
                <div className="flex flex-col space-y-1">
                  <h3 className="text-white uppercase font-bold font-body">Cast</h3>
                  <p className="text-white text-sm sm:text-base">{cast}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Showtimes + Trailer (bottom stuff) */}
          <div className="flex flex-col lg:flex-row justify-center gap-12 w-full px-2 lg:pt-20">

            {/* Showtimes */}
            <div className="flex flex-col w-full lg:w-1/2 gap-4">
              <h2 className="text-white font-medium">Showtimes</h2>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col py-4">
                  <h3 className="text-white font-bold font-body">9/22</h3>
                  <div className="flex flex-wrap gap-x-4 gap-y-4 py-2 max-w-md">
                    {Array.isArray(movieData.show_times) && movieData.show_times.length > 0 ? (
                      movieData.show_times.map((timestamp, index) => (
                        <button 
                          key={`${timestamp}-${index}`}
                          className="rounded-full hover:text-gray-400 hover:cursor-pointer text-white font-special border px-6 py-2 text-sm sm:text-base"
                          type="button"
                        >
                          {formatShowtime(timestamp)}
                        </button>
                      ))
                    ) : (
                      <p className="text-white text-sm">No showtimes available</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Trailer */}
            <div className="flex flex-col w-full lg:w-1/2 gap-6">
              <h2 className="text-white font-medium border-b border-white">Trailer</h2>
              <div className="w-full aspect-video bg-gray-800 flex rounded-2xl justify-center items-center">
      
                {movieData.trailer_video ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${movieData.trailer_video}`}
                    title={`${movieData.title} Trailer`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-2xl"
                  ></iframe>
                ) : (
                  <p className="text-white">Trailer not available</p>
                )}
                           
              </div>
            </div>

          </div>
        </div>
    );
}