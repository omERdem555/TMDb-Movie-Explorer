import { useEffect, useState } from "react";
import type { Movie } from "../types/movie.types";
import { fetchMovies, searchMovies } from "../api/movies.api";

export const useMovies = (type: string, page: number, search: string) => {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        let res;

        // Search mode
        if (search && search.trim().length > 0) {
          res = await searchMovies(search, page);
        }
        // Discover mode
        else {
          res = await fetchMovies(type, page);
        }

        // Backend contract: { success: true, data: [...] }
        setData(res.data);
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    // ⏱️ debounce (API spam önleme)
    const timeout = setTimeout(() => {
      load();
    }, 300);

    return () => clearTimeout(timeout);
  }, [type, page, search]);

  return { data, loading, error };
};