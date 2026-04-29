import { useState } from "react";
import { useMovies } from "../hooks/useMovies";
import MovieGrid from "../components/MovieGrid";

export default function Home() {
  const [type, setType] = useState("popular");
  const [page] = useState(1);

  const { data, loading, error } = useMovies(type, page);

  return (
    <div style={{ padding: "20px" }}>
      <h1>TMDb Movie Explorer</h1>

      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <button onClick={() => setType("popular")}>Popular</button>
        <button onClick={() => setType("top_rated")}>Top Rated</button>
        <button onClick={() => setType("upcoming")}>Upcoming</button>
      </div>

      {loading && <div>Loading movies...</div>}

      {error && <div>Error: {error}</div>}

      {!loading && !error && <MovieGrid movies={data} />}
    </div>
  );
}