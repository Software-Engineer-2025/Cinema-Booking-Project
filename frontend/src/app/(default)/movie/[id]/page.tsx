import Image from "next/image";
import { StarFilledIcon, StarIcon } from "@radix-ui/react-icons";           


export default function MoviePage() {
    const movie = {
        title: "How to Train Your Dragon",
        poster: "/placeholder-movie-poster.png",
        rating: Math.floor(4.9),
    };



  return (

    // main container 
    <div className="bg-black flex gap-10 px-50">
        {/* Movie Info */}
            {/* Movie Info 1 (Left Stuff) Hug*/}
            <div className="bg-red-600 w-2/5 flex flex-col gap-3">
                {/* poster */}
                <div className="relative w-full max-w-xs aspect-[2/3]">
                    <Image
                        src= {movie.poster}
                        alt="Movie Poster"
                        fill
                        className="rounded-xl shadow-lg object-cover"
                    />
                </div>
                {/* title */}
                <h1 className="text-white uppercase">{movie.title}</h1>
                {/* Rating */}
                <div className="flex mt-2">
                {Array.from({ length: 5 }).map((_, i) =>
                    i < movie.rating ? (
                    <StarFilledIcon key={i} className="w-6 h-6 text-white" />
                    ) : (
                    <StarIcon key={i} className="w-6 h-6 text-white" />
                    )
                )}
                </div>

            </div>

            {/* Movie Info 2 (Right Stuff) Fill*/} 
            <div className="bg-blue-600 w-3/5">
                {/* Description */}
                <p className="text-white">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            </div>
        {/* Showtimes + Trailer */}
    </div>
  )
}