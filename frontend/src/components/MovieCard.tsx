import type { Movie } from "../types/movie.types";
import { Link } from "react-router-dom";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  const shortOverview =
    movie.overview.length > 100
      ? movie.overview.slice(0, 100) + "..."
      : movie.overview;

  return (
    <Link
      to={`/movie/${movie.id}`}
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          padding: 10,
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          cursor: "pointer",
        }}
      >
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{
              width: "100%",
              borderRadius: "4px",
              marginBottom: "10px",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "375px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#f0f0f0",
              marginBottom: "10px",
              borderRadius: "4px",
            }}
          >
            No Image
          </div>
        )}

        <h3>{movie.title}</h3>

        <p>{shortOverview}</p>

        <small>⭐ {movie.rating}</small>
      </div>
    </Link>
  );
}