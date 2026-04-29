import { useState } from "react";
import { useMovies } from "../hooks/useMovies";
import MovieGrid from "../components/MovieGrid";

export default function Home() {
  const [type] = useState("popular");
  const [page] = useState(1);

  const { data, loading, error } = useMovies(type, page);

  if (loading) {
    return <div>Loading movies...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Movies</h1>
      <MovieGrid movies={data} />
    </div>
  );
}