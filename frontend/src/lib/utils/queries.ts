import {
  getGenresApiV1MoviesGenresGet,
  listMoviesApiV1MoviesGet,
  getMovieApiV1MoviesMovieIdGet,
} from "@/client";

// Fetches all movies
export const allMoviesQuery = () => ({
  queryKey: ["movies"],
  queryFn: async () => {
    // Note: The client function for listMoviesApiV1MoviesGet does not accept arguments.
    const response = await listMoviesApiV1MoviesGet();
    return response.data;
  },
});

// Fetches all genres
export const allGenresQuery = () => ({
  queryKey: ["genres"],
  queryFn: async () => {
    const response = await getGenresApiV1MoviesGenresGet();
    return response.data;
  },
});

// Fetches a single movie and its shows
export const movieDetailsQuery = (movieId: number) => ({
  queryKey: ["shows", movieId],
  queryFn: async () => {
    // FIX: The generated client expects path parameters to be wrapped in a 'path' object.
    const response = await getMovieApiV1MoviesMovieIdGet({
        path: {
            movie_id: movieId,
        }
    });
    return response.data;
  },
});


