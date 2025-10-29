import {
  getGenresApiV1MoviesGenresGet,
  listMoviesApiV1MoviesGet,
  getMovieApiV1MoviesMovieIdGet,
} from "@/client";

// Fetches all movies
export const allMoviesQuery = () => ({
  queryKey: ["movies"],
  queryFn: async () => {
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
    const response = await getMovieApiV1MoviesMovieIdGet({
        path: {
            movie_id: movieId,
        }
    });
    return response.data;
  },
});

/*
 * checks current user profile.
 */
export const currentUserProfileQuery = () => ({
  queryKey: ["currentUserProfile"],
  queryFn: async () => {
    const response = await fetch("http://localhost:8000/api/v1/users/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) throw new Error("Not authenticated");
    return response.json();
  },
});



