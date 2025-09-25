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
<div className="flex-col gap-12 px-4 lg:max-w-[1400px] mx-auto sm:px-6 md:px-12 sm:py-8 md:py-25 justify-center lg:min-w-[900px]">
  
  {/* Movie Info (top info)*/}
  <div className="flex flex-col lg:flex-row justify-center gap-8 lg:gap-16 lg:pb-10 ">
    
    {/* Left Movie Info (Poster + Title + Rating) */}
    <div className="px-3 flex flex-col gap-6 w-full lg:w-auto items-start lg:items-start">
      {/* poster */}
      <div className="relative w-full max-w-xs aspect-[2/3]">
        <Image
          src={movie.poster}
          alt="Movie Poster"
          fill
          className="rounded-xl shadow-lg object-cover"
        />
      </div>
      {/* title */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl text-white uppercase py-4 sm:py-2">{movie.title}</h1>
      {/* Rating */}
      <div className="flex ">
        {Array.from({ length: 5 }).map((_, i) =>
          i < movie.rating ? (
            <StarFilledIcon key={i} className="w-6 h-6 text-white" />
          ) : (
            <StarIcon key={i} className="w-6 h-6 text-white" />
          )
        )}
      </div>
    </div>

    {/* Right Movie Info (Description + Grid) */}
    <div className="py-4 sm:py-6 w-full lg:w-3/5 px-4 sm:px-6 md:px-10 gap-9 flex flex-col">
      <h2 className="text-white w-full border-b border-white font-medium">Description</h2>

      <div>
        <h3 className="text-white uppercase font-bold font-body">Synopsis</h3>
        <p className="text-white text-sm sm:text-base md:text-base">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sapiente officia cupiditate unde hic vel repellat iusto perferendis nostrum nesciunt a, ipsam soluta tempore, illo enim, nisi dicta. Numquam, nisi ipsam.
        </p>
      </div>

      <div className="grid gap-y-8 grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col space-y-1">
          <h3 className="text-white uppercase font-bold font-body">Rating</h3>
          <p className="text-white font-bold font-special text-2xl sm:text-3xl border w-fit px-4 py-1">PG</p>
        </div>
        <div className="flex flex-col space-y-1">
          <h3 className="text-white uppercase font-bold font-body">Category</h3>
          <p className="text-white text-sm sm:text-base">Animation, Adventure, Comedy</p>
        </div>
        <div className="flex flex-col space-y-1">
          <h3 className="text-white uppercase font-bold font-body">Creators</h3>
          <p className="text-white text-sm sm:text-base">William Davies, Dean DeBlois, Chris Sanders</p>
        </div>
        <div className="flex flex-col space-y-1">
          <h3 className="text-white uppercase font-bold font-body">Cast</h3>
          <p className="text-white text-sm sm:text-base">Jay Baruchel, Gerard Butler, Craig Ferguson, America Ferrera</p>
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
            <button className="rounded-full hover:text-gray-400 hover:cursor-pointer text-white font-special border px-6 py-2 text-sm sm:text-base">4:00pm</button>
            <button className="rounded-full hover:text-gray-400 hover:cursor-pointer text-white font-special border px-6 py-2 text-sm sm:text-base">4:00pm</button>
            <button className="rounded-full hover:text-gray-400 hover:cursor-pointer text-white font-special border px-6 py-2 text-sm sm:text-base">4:00pm</button>
            <button className="rounded-full hover:text-gray-400 hover:cursor-pointer text-white font-special border px-6 py-2 text-sm sm:text-base">4:00pm</button>
            <button className="rounded-full hover:text-gray-400 hover:cursor-pointer text-white font-special border px-6 py-2 text-sm sm:text-base">4:00pm</button>
          </div>
        </div>
      </div>
    </div>

    {/* Trailer */}
    <div className="flex flex-col w-full lg:w-1/2 gap-6">
      <h2 className="text-white font-medium border-b border-white">Trailer</h2>
      <div className="w-full aspect-video bg-gray-800 flex rounded-2xl justify-center items-center">
        <p className="text-white">Trailer Embed</p>
      </div>
    </div>

  </div>
</div>

  )
}