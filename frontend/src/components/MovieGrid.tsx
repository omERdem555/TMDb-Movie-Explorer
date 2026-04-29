import type { Movie } from "../types/movie.types";
import MovieCard from "./MovieCard";

type Props = {
  movies: Movie[];
};

export default function MovieGrid({ movies }: Props) {
  if (!movies.length) {
    return <p>No movies found.</p>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: "20px",
        padding: "20px 0",
      }}
    >
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}