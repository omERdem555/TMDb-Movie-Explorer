import { useEffect, useState } from "react";
import { fetchMovies, searchMovies } from "../api/movies.api";
import type { Movie } from "../types/movie.types";

type UseMoviesResult = {
  data: Movie[];
  loading: boolean;
  error: string | null;
};

export const useMovies = (
  type: string,
  search: string,
  page: number
): UseMoviesResult => {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const isSearch = search.trim().length > 0;

        let result: Movie[];

        if (isSearch) {
          result = await searchMovies(search, type, page);
        } else {
          result = await fetchMovies(type, page);
        }

        setData(result);
      } catch (e) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, search, page]);

  return { data, loading, error };
};