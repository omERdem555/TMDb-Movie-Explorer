import type { Movie } from "../types/movie.types";
import MovieCard from "./MovieCard";

type Props = {
  movies: Movie[];
  loading?: boolean;
};

export default function MovieGrid({ movies }: Props) {
  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div key={movie.id} style={{ width: "100%" }}>
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
}