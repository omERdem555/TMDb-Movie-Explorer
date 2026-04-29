import { useEffect, useState } from "react";
import { fetchMovies } from "../api/movies.api";
import type { Movie } from "../types/movie.types";

export const useMovies = (type: string, page: number) => {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetchMovies(type, page);
        setData(res.data);
      } catch (err) {
        setError("Failed to fetch movies");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, page]);

  return { data, loading, error };
};