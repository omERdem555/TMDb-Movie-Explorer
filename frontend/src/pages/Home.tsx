import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import MovieGrid from "../components/MovieGrid";
import type { Movie } from "../types/movie.types";

const API_BASE = "http://localhost:5000/api";

export default function Home() {
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type") || "popular";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);

  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1) DISCOVER
        const res = await axios.get(`${API_BASE}/movies/discover`, {
          params: { type, page },
        });

        let movies: Movie[] = res.data.data;

        // 2) SEARCH FILTER (type korunur)
        if (search.trim().length > 0) {
          const q = search.toLowerCase();

          movies = movies.filter((m) =>
            m.title.toLowerCase().includes(q)
          );
        }

        setData(movies);
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, search, page]);

  return (
    <div style={{ padding: 20 }}>
      <h1>{type.toUpperCase()} Movies</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p>No results found</p>
      )}

      <MovieGrid movies={data} />
    </div>
  );
}