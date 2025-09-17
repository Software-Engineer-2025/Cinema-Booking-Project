import { getGenresApiV1MoviesGenresGet, listMoviesApiV1MoviesGet } from '@/client';

export const allMoviesQuery = () => ({
    queryKey: ['movies'],
    queryFn: async () => {
        const response = await listMoviesApiV1MoviesGet(); 
        return response.data;
    },
})

export const allGenresQuery = () => ({
    queryKey: ['genres'],
    queryFn: async () => {
        const response = await getGenresApiV1MoviesGenresGet(); 
        return response.data;
    },
})