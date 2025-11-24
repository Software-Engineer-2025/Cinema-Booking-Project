"use client"

import {useState} from "react";
import MovieTable from "./MovieTable";
import BlackButton from "../ui/BlackButton";
import {useQuery} from "@tanstack/react-query";
import {
  allMoviesQuery,
  useAddMovieCard, useAddShowCard,
  useDeleteMovieCard,
  useDeleteShowByIdCard
} from "@/lib/utils/queries";
import {useEffect} from "react";
import {getShowsByMovieApiV1ShowsMovieMovieIdGet, Movie, MovieCreate, Show, ShowCreate} from "@/client";
import {toast} from "sonner";
import {isValidDate} from "@/lib/utils/regex";

export default function MovieTab() {

  const newMovie: Movie = {
    movie_id: (0-(Date.now())),
    title: "New Movie",
    release_date: "",
    director: "",
    cast_list: [],
    genre: [],
    rating: null,
    producer: "",
    synopsis: "",
    reviews: [],
    trailer_img: "",
    trailer_video: "",
    mpaa_rating: "",
    released: false,
    featured: false,
    duration: 0,
  };

  const [movies, setMovies] = useState<Movie>([newMovie]);

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
        prev.map((m) => {
          if (m.movie_id === id) {
            // If it's an array field and value is a string, split it
            if ((field === 'genre' || field === 'cast_list' || field === 'reviews') && typeof value === 'string') {
              return { ...m, [field]: value.split(',').map(item => item.trim()).filter(Boolean) };
            }
            if ((field === 'featured' || field === 'released') && typeof value === 'string' && (value === 'true' || value === 'false')) {
              return { ...m, [field]: value === 'true'};
            } else if ((field === 'featured' || field === 'released') && typeof value === 'string') {
              toast(`Problem in field ${field}`, {
                description: "Need to set value to true or false",
                action: {
                  label: "done"
                }
              });
              return { ...m, [field]: false};
            }
            return { ...m, [field]: value };
          }
          return m;
        })
    );
  };

  // checks if the movie_id is positive (when it's been saved) and then attempts to delete it from the database
  const handleDeleteMovie = (id) => {
    try{
      if(id > 0) {
        deleteMovie.mutate(id);
      }
      setMovies((prev) => prev.filter((m) => m.movie_id !== id));
      toast("Movie has been deleted!", {
        description: "It should no longer appear in the database or in the webapp.",
        action: {
          label: "done"
        }
      });
    } catch (error) {
      toast("Movie has failed to be deleted", {
        description: error.message,
        action: {
          label: "done"
        }
      });
    }
  };

  const deleteShow = useDeleteShowByIdCard();
  const addShow = useAddShowCard();

  // Helper function to update shows
  const updateShows = async (newMovieId: number, showsToUpdate: Show[]) => {
    for (const show of showsToUpdate) {
      const showToMake: ShowCreate = {
        movie_id: newMovieId,
        showroom_id: show.showroom_id,
        date: show.date,
        time: show.time,
      };

      try {
        await deleteShow.mutateAsync(show.show_id);
        await addShow.mutateAsync(showToMake);
      } catch (error) {
        throw error;
      }
    }
  };

  const handleSaveMovie = async (movie) => {
    try {
      // Check for empty values
      Object.keys(movie).forEach(key => {
        if(key != "show_times" && key != "movie_id" && key != "released" && key != "featured" && key != "genre" && key != "cast_list" && key != "reviews") {
          if (movie[key] === newMovie[key] || movie[key] === "" || movie[key] === null) {
            throw new Error(`Need to fill in value: ${key}`);
          }
        }
      });

      //a bunch of validation for the different values
      if (!isValidDate(movie.release_date)) {
        throw new Error("Not a valid date");
      }

      if (typeof movie.released !== "boolean") {
        throw new Error("Not a valid boolean value for released: true or false needed");
      }

      if (typeof movie.featured !== "boolean") {
        throw new Error("Not a valid boolean value for featured: true or false needed");
      }

      const numCheckDuration = Number(movie.duration)
      if (!(!isNaN(numCheckDuration) && isFinite(numCheckDuration) && numCheckDuration > 0)) {
        throw new Error("Not a valid number value for duration: please put integer number above 0");
      }

      const numCheckRating = Number(movie.rating)
      if (!(!isNaN(numCheckRating) && isFinite(numCheckRating) && numCheckRating >= 0 && numCheckRating <= 10)) {
        throw new Error("Not a valid number value for rating: please put score between 0 and 10");
      }

      const passableMovie: MovieCreate = {
        title: movie.title,
        release_date: movie.release_date || null,
        director: movie.director || null,
        cast_list: movie.cast_list || [],
        rating: movie.rating || null,
        producer: movie.producer || null,
        synopsis: movie.synopsis || null,
        reviews: movie.reviews || [],
        trailer_img: movie.trailer_img || null,
        trailer_video: movie.trailer_video || null,
        mpaa_rating: movie.mpaa_rating || null,
        duration: movie.duration,
        released: movie.released || false,
        featured: movie.featured || false,
        genre_names: movie.genre || [],
      };

      let oldShows: Show[] = [];
      if (movie.movie_id > 0) {
        try {
          const showsResponse = await getShowsByMovieApiV1ShowsMovieMovieIdGet({
            path: { movie_id: movie.movie_id }
          });
          oldShows = showsResponse.data || [];
        } catch (error) {
          console.error("Failed to fetch old shows:", error);
        }
      }

      addMovie.mutate(passableMovie, {
        onSuccess: async (createdMovie) => {
          try {
            if (movie.movie_id > 0 && oldShows.length > 0) {
              await updateShows(createdMovie.movie_id, oldShows);
            }

            if (movie.movie_id > 0) {
              await deleteMovie.mutateAsync(movie.movie_id);
            }

            refetchMovies();

            toast("Movie has been saved!", {
              description: movie.movie_id > 0
                  ? "Updated movie details"
                  : "New movie created successfully",
              action: {
                label: "done"
              }
            });

          } catch (error) {
            console.error("Error during update process:", error);
            toast("Movie created but error during update", {
              description: error.message,
              action: {
                label: "done"
              }
            });
            refetchMovies();
          }
        },
        onError: (error) => {
          toast("There was an error when trying to save the movie", {
            description: error.message,
            action: {
              label: "done"
            }
          });
        }
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
        refetch={refetchMovies}
      />
      <></>
    </div>
  );
}
