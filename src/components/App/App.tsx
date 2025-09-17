import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovies, type MovieResponse } from '../../services/movieService';
import type { Movie } from '../../types/movie';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import Loader from '../Loader/Loader';
import MovieModal from '../MovieModal/MovieModal';
import ReactPaginate from 'react-paginate';
import { toast, Toaster } from 'react-hot-toast';
import styles from './App.module.css';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, error } = useQuery<MovieResponse, Error>({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: !!query,
    placeholderData: (previousData) => previousData, 
  });

  
  useEffect(() => {
    if (isError && error) {
      toast.error(error.message || 'There was an error fetching the movies.');
      console.error('Error:', error);
    }
  }, [isError, error]);


  useEffect(() => {
    if (data && data.results.length === 0 && query) {
      toast.error('No movies found for your request.');
    }
  }, [data, query]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setPage(1);
  };

  const handleSelectMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const results = data?.results || [];
  const totalPages = data?.total_pages || 0;

  return (
    <div>
      <Toaster />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}

      {results.length > 0 && (
        <>
          <MovieGrid movies={results} onSelect={handleSelectMovie} />
          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={styles.pagination}
              activeClassName={styles.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default App;
