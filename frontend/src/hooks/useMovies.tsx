import { useEffect, useState } from "react";
import type { Movie } from "../types/movie.types";
import { fetchMovies } from "../api/movies.api";

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

        const allMovies: Movie[] = [];

        // İlk 5 sayfa preload
        for (let i = 1; i <= 5; i++) {
          const movies = await fetchMovies(type, i);
          allMovies.push(...movies);
        }

        let filteredMovies = allMovies;

        // SEARCH FILTER
        if (search.trim()) {
          const q = search.toLowerCase();

          filteredMovies = filteredMovies.filter((movie) =>
            movie.title.toLowerCase().includes(q)
          );
        }

        // PAGINATION (20 item standard)
        const itemsPerPage = 20;
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;

        setData(filteredMovies.slice(start, end));
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, search, page]);

  return { data, loading, error };
};