import { useSearchParams } from "react-router-dom";
import MovieGrid from "../components/MovieGrid";
import { useMovieQuery } from "../hooks/useMovieQuery";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get("type") || "popular";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);

  const { data, loading, error } = useMovieQuery(type, search, page);

  return (
    <div className="container">
      <h1>{type.toUpperCase()} Movies</h1>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && data.length === 0 && (
        <p>No movies found</p>
      )}

      <MovieGrid movies={data} loading={loading} />

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