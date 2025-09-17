import axios from 'axios';
import type { MovieResponse } from '../types/movie';

const API_TOKEN = import.meta.env.VITE_TMDB_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MovieResponse> => {
  try {
    const response = await axios.get<MovieResponse>(`${BASE_URL}/search/movie`, {
      params: {
        query,
        page, 
        language: 'en-US',
      },
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return response.data; 
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error; 
  }
};
