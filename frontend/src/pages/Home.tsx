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

        const res = await axios.get(`${API_BASE}/movies/discover`, {
          params: { type, page },
        });

        let movies: Movie[] = res.data.data;

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

  // 🧨 ERROR STATE (EN ÜST PRIORITY)
  if (error) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "#ff6b6b",
        }}
      >
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  // 🧠 EMPTY STATE (loading bittikten sonra)
  if (!loading && data.length === 0) {
    return (
      <div
        style={{
          padding: 40,
          textAlign: "center",
          color: "#888",
        }}
      >
        <h3>No movies found</h3>
        <p>Try changing your search or category</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{type.toUpperCase()} Movies</h1>

      <MovieGrid movies={data} loading={loading} />
    </div>
  );
}