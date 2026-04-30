import type { Movie } from "../types/movie.types";
import MovieCard from "./MovieCard";
import MovieSkeleton from "./MovieSkeleton";

type Props = {
  movies: Movie[];
  loading?: boolean;
};

export default function MovieGrid({ movies, loading }: Props) {
  const skeletons = Array.from({ length: 12 });

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(6, 1fr)",
        gap: "25px",
        padding: "20px 0"
      }}
    >
      {loading
        ? skeletons.map((_, i) => <MovieSkeleton key={i} />)
        : movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
    </div>
  );
}