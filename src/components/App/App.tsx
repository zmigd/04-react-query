import React, { useState } from 'react';
import { fetchMovies } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage'; 
import MovieModal from '../MovieModal/MovieModal';
import { toast, Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    try {
      const results = await fetchMovies(query);
      if (results.length === 0) {
        toast.error('No movies found for your request.');
      }
      setMovies(results);
    } catch (err: unknown) {
      
      if (err instanceof Error) {
        toast.error(`There was an error fetching the movies: ${err.message}`);
        setError(`There was an error fetching the movies: ${err.message}`);
      } else {
        toast.error('Unknown error occurred.');
        setError('Unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />
      
      {loading && <Loader />}
      
      
      {error && <ErrorMessage />}
      
      
      {!loading && !error && <MovieGrid movies={movies} onSelect={handleSelectMovie} />}
      
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;
