"use client";

import { useState, useMemo, useEffect } from "react";
import { ListBulletIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import Fuse from "fuse.js";
import { useQuery } from "@tanstack/react-query";
import { allGenresQuery, allMoviesQuery } from "@/lib/utils/queries";
import { Movie } from "@/client";
import Link from "next/link";

interface MovieFilters {
  genres?: string[];
}

export default function MovieGrid() {
  const { data: allMovies = [] } = useQuery(allMoviesQuery());
  const { data: genres = [] } = useQuery(allGenresQuery());

  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<MovieFilters>({});

  // Fuse config
  const fuse = useMemo(
    () =>
      new Fuse(allMovies, {
        keys: [
          { name: "title", weight: 0.7 },
          { name: "genre", weight: 0.1 },
          { name: "director", weight: 0.1 },
          { name: "producer", weight: 0.1 },
          { name: "cast_list", weight: 0.1 },
          { name: "synopsis", weight: 0.1 },
        ],
        threshold: 0.3,
      }),
    [allMovies]
  );

  // Tack on search term and filters
  const filteredMovies = useMemo(() => {
    let result = searchTerm
      ? fuse.search(searchTerm).map((r) => r.item)
      : allMovies;

    if (currentFilters.genres?.length) {
      result = result.filter((m) =>
        currentFilters.genres?.some((g) =>
          m.genre?.toLowerCase().includes(g.toLowerCase())
        )
      );
    }

    return result;
  }, [allMovies, fuse, searchTerm, currentFilters]);

  const totalPages = Math.ceil(filteredMovies.length / pageSize);

  const paginatedMovies = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMovies.slice(start, start + pageSize);
  }, [filteredMovies, currentPage, pageSize]);

  // Apply search term only after user enters or clicks search
  const handleSearch = () => {
    setSearchTerm(inputValue);
    setCurrentPage(1);
  };

  const toggleGenre = (genre: string) => {
    const newlySelected = currentFilters.genres?.includes(genre)
      ? currentFilters.genres.filter((g) => g !== genre)
      : [...(currentFilters.genres || []), genre];
    setCurrentFilters({ genres: newlySelected });
  };

  // Resize table/grid based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setPageSize(6);
      else if (window.innerWidth < 1024) setPageSize(8);
      else setPageSize(15);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-black/60 backdrop-blur-md p-6 shadow-lg">
        <h1 className="text-2xl mb-4 text-center">Movies</h1>
        <div className="flex flex-wrap items-center gap-3 relative">
          <button
            onClick={() => setFilterOpen((prev) => !prev)}
            className="flex items-center gap-2 px-5 py-2 border border-white/80 hover:bg-white/10 transition cursor-pointer"
          >
            <ListBulletIcon className="h-4 w-4" />
            FILTER
          </button>
          <FilterMenu
            genres={genres}
            currentFilters={currentFilters}
            toggleGenre={toggleGenre}
            isOpen={filterOpen}
          />
          <SearchBar
            inputValue={inputValue}
            setInputValue={setInputValue}
            handleSearch={handleSearch}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {paginatedMovies.map((movie) => (
          <MovieCard key={movie.movie_id} movie={movie} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

function FilterMenu({
  genres,
  currentFilters,
  toggleGenre,
  isOpen,
}: {
  genres: string[];
  currentFilters: { genres?: string[] };
  toggleGenre: (genre: string) => void;
  isOpen: boolean;
}) {
  return (
    <div
      className={`absolute top-full left-0 mt-2 w-65 sm:w-70 bg-black/90 shadow-lg transition-all duration-300 origin-top
        ${
          isOpen
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95 pointer-events-none"
        }
      `}
    >
      <div className="p-4 space-y-4">
        <h3 className="font-semibold text-lg">Filters</h3>
        <h4 className="font-semibold">Genre</h4>
        <div className="flex flex-wrap gap-2">
          {genres.map((genre) => {
            const active = currentFilters.genres?.includes(genre);
            return (
              <button
                key={genre}
                onClick={() => toggleGenre(genre)}
                className={`px-3 py-1 border font-medium cursor-pointer ${
                  active
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-white border-white/50 hover:bg-white/20"
                }`}
              >
                {genre}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SearchBar({
  inputValue,
  setInputValue,
  handleSearch,
}: {
  inputValue: string;
  setInputValue: (val: string) => void;
  handleSearch: () => void;
}) {
  return (
    <div className="flex flex-1 items-center bg-white/10 ">
      <input
        type="text"
        placeholder="Search by movie..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="flex-1 px-4 py-2 bg-transparent text-white placeholder-gray-400 focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className="px-3 py-2  bg-white/10 hover:bg-gray-600 flex items-center justify-center rounded-2xl"
      >
        <MagnifyingGlassIcon className="w-4 h-4" color="white" />
      </button>
    </div>
  );
}

function MovieCard({ movie }: { movie: Movie }) {
  const starCount = Math.round((movie.rating ?? 0) / 2);
  return (
    <Link href={`/movies/${movie?.movie_id}`}>
      <div className="bg-black/70  shadow-lg overflow-hidden hover:scale-105 transition-transform">
        <div className="w-full aspect-[2/3] overflow-hidden ">
          <img src={movie.trailer_img} className="w-full h-full object-cover" />
        </div>
        <div className="bg-black text-center p-3 ">
          <h2 className="text-lg font-semibold truncate">{movie.title}</h2>
          <div className="flex justify-center mt-1 text-sm">
            {Array.from({ length: 5 }).map((_, idx) => (
              <span
                key={idx}
                className={idx < starCount ? "text-white" : "text-gray-600"}
              >
                ★
              </span>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-1 truncate">{movie.genre}</p>
        </div>
      </div>

    </Link>
  );
}

// Pagination for movie list table/grid
function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}: {
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}) {
  return (
    <div className="flex justify-center mt-4 gap-2 overflow-x-auto">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-white/20 hover:bg-white/40"
      >
        Prev
      </button>
      {[...Array(totalPages)].map((_, idx) => (
        <button
          key={idx}
          onClick={() => setCurrentPage(idx + 1)}
          className={`px-3 py-1 ${
            currentPage === idx + 1
              ? "bg-white text-black"
              : "bg-white/20 hover:bg-white/40"
          }`}
        >
          {idx + 1}
        </button>
      ))}
      <button
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-white/20 hover:bg-white/40"
      >
        Next
      </button>
    </div>
  );
}
