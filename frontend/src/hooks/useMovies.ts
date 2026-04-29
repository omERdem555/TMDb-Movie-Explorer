import { useEffect, useState } from "react";
import type { Movie } from "../types/movie.types";
import { fetchMovies } from "../api/movies.api";

export const useMovies = (type: string, page: number) => {
  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const movies = await fetchMovies(type, page);

        setData(movies); // ✅ düz Movie[]
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, page]);

  return { data, loading, error };
};