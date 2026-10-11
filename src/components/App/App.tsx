import { useCallback, useState } from "react";
import { toast } from "react-hot-toast";
import SearchBar from "../SearchBar/SearchBar";
import { searchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  async function handleSearch(query: string) {
    setMovies([]);
    setLoading(true);
    setIsError(false);

    try {
      const results = await searchMovies(query);

      if (results.length === 0) {
        toast.error("No movies found for your request.");
        return;
      }
      setMovies(results);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setIsError(true);
      toast.error("Failed to fetch movies. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(movie: Movie) {
    setSelectedMovie(movie);
  }
  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <>
      <SearchBar onSearch={handleSearch} />
      {isLoading && <Loader />}
      {!isLoading && isError && <ErrorMessage />}
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelect} />
      )}
      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </>
  );
}
