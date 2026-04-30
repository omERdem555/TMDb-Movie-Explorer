import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import MovieGrid from "../components/MovieGrid";
import type { Movie } from "../types/movie.types";

const API_BASE = "http://localhost:5000/api";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get("type") || "popular";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);

  const [data, setData] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🔥 DATA FETCH
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(`${API_BASE}/movies/discover`, {
          params: { type, page },
        });

        let movies: Movie[] = res.data.data;

        // search filter (type korunur)
        if (search.trim().length > 0) {
          const q = search.toLowerCase();

          movies = movies.filter((m) =>
            m.title.toLowerCase().includes(q)
          );
        }

        // 🔥 18 film limit
        movies = movies.slice(0, 18);

        setData(movies);
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, search, page]);

  // 🔥 RESET PAGE ON TYPE/SEARCH CHANGE
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    });
  }, [type, search]);

  // 🧨 ERROR STATE
  if (error) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#ff6b6b" }}>
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  // 🧠 EMPTY STATE
  if (!loading && data.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#888" }}>
        <h3>No movies found</h3>
        <p>Try changing your search or category</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>{type.toUpperCase()} Movies</h1>

      <MovieGrid movies={data} loading={loading} />

      {/* PAGINATION */}
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button
          onClick={() =>
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.set("page", String(Math.max(1, page - 1)));
              return next;
            })
          }
          disabled={page === 1}
        >
          Prev
        </button>

        <span>Page: {page}</span>

        <button
          onClick={() =>
            setSearchParams((prev) => {
              const next = new URLSearchParams(prev);
              next.set("page", String(page + 1));
              return next;
            })
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}