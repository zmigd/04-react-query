import axios from 'axios';
import type { Movie } from '../types/movie';

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

interface MoviesResponse {
  results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await axios.get<MoviesResponse>(`${BASE_URL}/search/movie`, {
      params: {
        query,
        language: 'en-US',
      },
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data.results;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};
