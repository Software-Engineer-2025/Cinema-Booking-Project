"use client"

import {useState} from "react";
import MovieTable from "./MovieTable";
import BlackButton from "../ui/BlackButton";
import {useQuery} from "@tanstack/react-query";
import {allMoviesQuery, useAddMovieCard, useDeleteMovieCard} from "@/lib/utils/queries";
import {useEffect} from "react";
import {MovieCreate} from "@/client";
import {toast} from "sonner";

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
      duration: 10,
      show_times: ["2025-10-28T19:00:00", "2025-10-28T21:30:00"],
    },
  ]);

  const newMovie = {
    movie_id: (0-(Date.now())),
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
    duration: 0,
    show_times: [],
  };

  const handleAddMovie = () => {
    setMovies([...movies, newMovie]);
  };

  const deleteMovie = useDeleteMovieCard();
  const addMovie = useAddMovieCard();

  const { data: allMovies = [], refetch: refetchMovies } = useQuery(allMoviesQuery());

  useEffect(() => {
    setMovies(allMovies);
  }, [allMovies]);


  const handleUpdateMovie = (id, field, value) => {
    setMovies((prev) =>
      prev.map((m) => (m.movie_id === id ? { ...m, [field]: value } : m))
    );
  };
  const handleDeleteMovie = (id) => {
    if(id < 0) {
      deleteMovie.mutate(id);
    }
    setMovies((prev) => prev.filter((m) => m.movie_id !== id));
  };

  const handleSaveMovie = (movie) => {
    try {
      Object.keys(movie).forEach(key => {
        if(key != "show_times" && key != "movie_id" && key != "released" && key != "featured" && movie[key] == newMovie[key]) {
          throw new Error("Need to fill in value: " + key);
        }
      });

      const genreArray = movie.genre ? movie.genre.split(",").map(g => g.trim()) : [];

      const passableMovie: MovieCreate = {
        title: movie.title,
        release_date: movie.release_date,
        director: movie.director,
        cast_list: movie.cast_list,
        rating: movie.rating,
        producer: movie.producer,
        synopsis: movie.synopsis,
        reviews: movie.reviews,
        trailer_img: movie.trailer_img,
        trailer_video: movie.trailer_video,
        mpaa_rating: movie.mpaa_rating,
        duration: movie.duration,
        released: movie.released,
        featured: movie.featured,
        genre_names: genreArray,
      };

      addMovie.mutate(passableMovie, {
        onSuccess: () => {
          if (movie.movie_id > 0) {
            deleteMovie.mutate(movie.movie_id, {
              onSuccess: () => {
                refetchMovies();
              },
            });
          } else {
            refetchMovies();
          }
        },
      });

    } catch (error) {
      toast("Please complete all required fields!", {
        description: error.message,
        action: {
          label: "done"
        }
      });
    }
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
        onSave={handleSaveMovie}
      />
      <></>
    </div>
  );
}
