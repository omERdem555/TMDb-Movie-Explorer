import { useEffect, useState } from "react";
import { fetchMovies, searchMovies } from "../api/movies.api";
import type { Movie } from "../types/movie.types";

export const useMovieQuery = (
  type: string,
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

        const isSearch = search.trim().length > 0;

        const result = isSearch
          ? await searchMovies(search, type, page)
          : await fetchMovies(type, page);

        setData(result);
      } catch {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, search, page]);

  return { data, loading, error };
};