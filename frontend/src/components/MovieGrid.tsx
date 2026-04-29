import type { Movie } from "../types/movie.types";
import MovieCard from "./MovieCard";

type Props = {
  movies: Movie[];
};

export default function MovieGrid({ movies }: Props) {
  if (!movies || movies.length === 0) {
    return <div>No movies found</div>;
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
      gap: "16px"
    }}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}