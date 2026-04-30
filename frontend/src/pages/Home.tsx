import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useMovies } from "../hooks/useMovies";
import MovieGrid from "../components/MovieGrid";

export default function Home() {
  const [searchParams] = useSearchParams();

  const type = searchParams.get("type") || "popular";
  const search = searchParams.get("search") || "";

  const [page, setPage] = useState(1);

  const { data, loading, error } = useMovies(type, page, search);

  const handleNextPage = () => setPage((p) => p + 1);
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));

  return (
    <div style={{ padding: 20 }}>
      <h1>
        {search
          ? `Search: ${search}`
          : type.replace("_", " ").toUpperCase()}
      </h1>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && <MovieGrid movies={data} />}

      <div style={{ marginTop: 20 }}>
        <button onClick={handlePrevPage}>Prev</button>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
}