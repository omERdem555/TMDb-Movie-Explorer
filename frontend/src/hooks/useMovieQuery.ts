import { useEffect, useState } from "react";
import { fetchMovies } from "../api/movies.api";
import type { Movie } from "../types/movie.types";

export const useMovieQuery = (
  type: string,
  genres: string,
  search: string,
  page: number
) => {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const result = await fetchMovies(
          type,
          page,
          genres,
          search
        );

        setData(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error("USE_MOVIE_QUERY_ERROR:", err);
        setError("Failed to load movies");
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, genres, search, page]);

  return {
    data,
    loading,
    error,
  };
};