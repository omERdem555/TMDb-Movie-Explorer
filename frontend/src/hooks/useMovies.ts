import { useEffect, useState } from "react";
import type { Movie } from "../types/movie.types";
import { fetchMovies } from "../api/movies.api";

const MOVIES_PER_PAGE = 20;
const PREFETCH_PAGES = 5;

export const useMovies = (type: string, currentPage: number) => {
  const [allMovies, setAllMovies] = useState<Movie[]>([]);
  const [visibleMovies, setVisibleMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Type değişince baştan yükle
  useEffect(() => {
    const loadBatch = async () => {
      try {
        setLoading(true);
        setError(null);

        const requests = [];

        for (let page = 1; page <= PREFETCH_PAGES; page++) {
          requests.push(fetchMovies(type, page));
        }

        const results = await Promise.all(requests);

        const merged = results.flat();

        setAllMovies(merged);
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    loadBatch();
  }, [type]);

  // Current page değişince local slice
  useEffect(() => {
    const start = (currentPage - 1) * MOVIES_PER_PAGE;
    const end = start + MOVIES_PER_PAGE;

    setVisibleMovies(allMovies.slice(start, end));
  }, [currentPage, allMovies]);

  return {
    data: visibleMovies,
    loading,
    error,
    totalLoaded: allMovies.length,
  };
};