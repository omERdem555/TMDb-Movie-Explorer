import { useSearchParams } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";
import { useMovies } from "../hooks/useMovies";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get("type") || "popular";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const { data, loading, error } = useMovies(type, search, page);

  return (
    <div className="container">
      <h1>{type.toUpperCase()} Movies</h1>

      {/* LOADING */}
      {loading && <LoadingState />}

      {/* ERROR */}
      {error && <ErrorState message={error} />}

      {/* EMPTY */}
      {!loading && !error && data.length === 0 && <EmptyState />}

      {/* GRID */}
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