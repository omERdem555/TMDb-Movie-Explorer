import type { Movie } from "../types/movie.types";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  return (
    <div style={{ border: "1px solid #ddd", padding: 10 }}>
      {movie.posterUrl && (
        <img
          src={movie.posterUrl}
          alt={movie.title}
          style={{ width: "100%" }}
        />
      )}

      <h3>{movie.title}</h3>

      <p>
        {movie.overview.length > 100
          ? movie.overview.slice(0, 100) + "..."
          : movie.overview}
      </p>

      <small>⭐ {movie.rating}</small>
    </div>
  );
}