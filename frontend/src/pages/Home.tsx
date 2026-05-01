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

        const allMovies: Movie[] = [];

        for (let i = 1; i <= 5; i++) {
          const res = await axios.get(`${API_BASE}/movies/discover`, {
            params: { type, page: i },
          });

          allMovies.push(...res.data.data);
        }

        let movies = allMovies;

        // search filter (type korunur)
        if (search.trim().length > 0) {
          const q = search.toLowerCase();

          movies = movies.filter((m) =>
            m.title.toLowerCase().includes(q)
          );
        }

        // 🔥 18 film limit
        const start = (page - 1) * 18;
        const end = start + 18;

        movies = movies.slice(start, end);

        setData(movies);
      } catch (err) {
        setError("Failed to load movies");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [type, search, page]);


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
    <div className="container">
      <h1>{type.toUpperCase()} Movies</h1>

      <MovieGrid movies={data} loading={loading} />
      
      {/* PAGINATION */}
      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button
          onClick={() => {
            const next = new URLSearchParams();

            next.set("type", type);
            next.set("page", String(Math.max(1, page - 1)));

            if (search.trim()) {
              next.set("search", search);
            }

            setSearchParams(next);
          }}
          disabled={page === 1}
        >
          Prev
        </button>

        <span>Page: {page}</span>

        <button
        onClick={() => {
          const next = new URLSearchParams();

          next.set("type", type);
          next.set("page", String(page + 1));

          if (search.trim()) {
            next.set("search", search);
          }

          setSearchParams(next);
        }}
        >
          Next
        </button>
      </div>
    </div>
  );
}