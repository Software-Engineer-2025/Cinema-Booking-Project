import { useState } from "react";
import MovieTable from "./MovieTable";
import BlackButton from "../ui/BlackButton";
export default function MovieTab() {
  const [movies, setMovies] = useState([
    {
      movie_id: 1,
      title: "Movie Name",
      release_date: "2010-07-16",
      director: "Some Director",
      cast_list: "Actor1, Actor2",
      genre: "Action, Sci-Fi",
      rating: 8.8,
      producer: "Some Producer",
      synopsis: "something",
      reviews: "Mind-blowing visuals and concept.",
      trailer_img: "trailer.jpg",
      trailer_video: "yt link",
      mpaa_rating: "PG-13",
      released: true,
      featured: false,
      show_times: ["2025-10-28T19:00:00", "2025-10-28T21:30:00"],
    },
  ]);
  const handleAddMovie = () => {
    const newMovie = {
      movie_id: Date.now(),
      title: "New Movie",
      release_date: "",
      director: "",
      cast_list: "",
      genre: "",
      rating: null,
      producer: "",
      synopsis: "",
      reviews: "",
      trailer_img: "",
      trailer_video: "",
      mpaa_rating: "",
      released: false,
      featured: false,
      show_times: [],
    };
    setMovies([...movies, newMovie]);
  };
  const handleUpdateMovie = (id, field, value) => {
    setMovies((prev) =>
      prev.map((m) => (m.movie_id === id ? { ...m, [field]: value } : m))
    );
  };
  const handleDeleteMovie = (id) => {
    setMovies((prev) => prev.filter((m) => m.movie_id !== id));
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Movies</h2>
        <BlackButton onClick={handleAddMovie} className="text-white">
          + Add Movie
        </BlackButton>
      </div>
      <MovieTable
        movies={movies}
        onUpdate={handleUpdateMovie}
        onDelete={handleDeleteMovie}
      />
    </div>
  );
}
