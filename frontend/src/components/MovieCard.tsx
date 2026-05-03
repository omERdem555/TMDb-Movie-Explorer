import type { Movie } from "../types/movie.types";
import { useNavigate, useLocation } from "react-router-dom";
import {
  toggleWatchlist,
  isInWatchlist,
  isInWatchedlist,
  addToWatched,
} from "../utils/MovieList";

type Props = {
  movie: Movie;
};

export default function MovieCard({ movie }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const saved = isInWatchlist(movie.id);
  const watched = isInWatchedlist(movie.id);

  const handleWatchlist = (e: React.MouseEvent) => {
    e.stopPropagation();

    toggleWatchlist({
      id: movie.id,
      title: movie.title,
      posterUrl: movie.posterUrl,
    });
    window.location.reload()
  };

  const handleWatched = (e: React.MouseEvent) => {
    e.stopPropagation();

    const note = prompt("Add a note (optional):") || "";

    addToWatched(
      {
        id: movie.id,
        title: movie.title,
        posterUrl: movie.posterUrl,
      },
      note
    );
    window.location.reload()
  };

  return (
    <div
      onClick={() =>
        navigate(
          `/movie/${movie.id}?from=${encodeURIComponent(
            location.pathname + location.search
          )}`
        )
      }
      style={{
        width: "100%",
        height: "100%",
        cursor: "pointer",
        borderRadius: 10,
        overflow: "hidden",
        background: "#1a1a1a",
        display: "flex",
        flexDirection: "column",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      {/* POSTER */}
      <div style={{ position: "relative", aspectRatio: "2 / 3" }}>
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <div>No Image</div>
        )}

        <div className="rating-badge">⭐ {movie.rating}</div>
      </div>

      {/* CONTENT */}
      <div style={{ padding: 10 }}>
        <h3 style={{ fontSize: 14 }}>{movie.title}</h3>

        <p style={{ fontSize: 12, color: "#aaa" }}>
          {movie.overview?.slice(0, 80)}
        </p>

        <button
          onClick={handleWatchlist}
          className="watchlist-btn"
        >
          {saved ? "✓ Saved" : "+ Watchlist"}
        </button>

        <button
          onClick={handleWatched}
          className="watchlist-btn watched-btn"
        >
          {watched ? "✓ Watched" : "Mark Watched"}
        </button>
      </div>
    </div>
  );
}