import {
  getGenresApiV1MoviesGenresGet,
  listMoviesApiV1MoviesGet,
  getMovieApiV1MoviesMovieIdGet,
  NewCardRequest,
  addPaymentCardEndpointApiV1CardsPost,
  getPaymentCardsEndpointApiV1CardsGet,
  updatePaymentCardEndpointApiV1CardsCardIdPatch,
  deletePaymentCardEndpointApiV1CardsCardIdDelete,
} from "@/client";
import { useMutation } from "@tanstack/react-query";

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

export const cardsQuery = () => ({
  queryKey: ["cards"],
  queryFn: async () => {
    const response = await getPaymentCardsEndpointApiV1CardsGet();
    return response.data;
  },
});

export const useAddPaymentCard = () => {
  return useMutation({
    mutationFn: async (newCard: NewCardRequest) => {
      const result = await addPaymentCardEndpointApiV1CardsPost({
        body: newCard,
      });

      if (result.error) {
        throw result.error;
      }

      return result.data!;
    },
  });
};

export const useUpdatePaymentCard = () => {
  return useMutation({
    mutationFn: async ({
      cardId,
      updatedCard,
    }: {
      cardId: string;
      updatedCard: NewCardRequest;
    }) => {
      const result = await updatePaymentCardEndpointApiV1CardsCardIdPatch({
        path: { card_id: cardId },
        body: updatedCard,
      });

      if (result.error) {
        throw result.error;
      }

      return result.data!;
    },
  });
};

export const useDeletePaymentCard = () => {
  return useMutation({
    mutationFn: async (cardId: string): Promise<void> => {
      const result = await deletePaymentCardEndpointApiV1CardsCardIdDelete({
        path: { card_id: cardId },
      });

      if (result.error) {
        throw result.error;
      }

      return result.data;
    },
  });
};

