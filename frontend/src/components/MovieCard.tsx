import type { Movie } from "../types/movie.types";
import { useNavigate } from "react-router-dom";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/movie/${movie.id}`)}
      style={{
        cursor: "pointer",
        borderRadius: 10,
        overflow: "hidden",
        background: "#1a1a1a",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget.style.transform = "scale(1.03)");
        (e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.4)");
      }}
      onMouseLeave={(e) => {
        (e.currentTarget.style.transform = "scale(1)");
        (e.currentTarget.style.boxShadow = "none");
      }}
    >
      {/* POSTER */}
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "2 / 3",
          overflow: "hidden",
          background: "#111",
        }}
      >
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: 12,
            }}
          >
            No Image
          </div>
        )}

        {/* RATING BADGE */}
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 8,
            background: "rgba(0,0,0,0.7)",
            padding: "4px 8px",
            borderRadius: 6,
            fontSize: 12,
            color: "#fff",
          }}
        >
          ⭐ {movie.rating}
        </div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: 10 }}>
        <h3
          style={{
            fontSize: 14,
            margin: "0 0 6px 0",
            color: "#fff",
          }}
        >
          {movie.title}
        </h3>

        <p
          style={{
            fontSize: 12,
            color: "#aaa",
            lineHeight: 1.4,
          }}
        >
          {movie.overview.length > 80
            ? movie.overview.slice(0, 80) + "..."
            : movie.overview}
        </p>
      </div>
    </div>
  );
}