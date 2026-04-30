import { useEffect, useState } from "react";
import type { Movie } from "../types/movie.types";
import { fetchMovies } from "../api/movies.api";

export const useMovies = (type: string, page: number, search: string) => {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchMovies(type, page);

        let movies = res.data;

        if (search.trim().length > 0) {
          movies = movies.filter((m) =>
            m.title.toLowerCase().includes(search.toLowerCase())
          );
        }

        setData(movies);
      } catch {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, page, search]);

  return { data, loading, error };
};