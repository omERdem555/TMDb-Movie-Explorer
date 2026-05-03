import { GENRES } from "../constants/genres";
import { useMemo } from "react";
import { getWatchlist, getWatchedlist  } from "../utils/MovieList.ts";
import { Link } from "react-router-dom";

type Props = {
  open: boolean;
  selectedGenres: string;
  watchlistOnly: boolean;
  onToggleWatchlistOnly: () => void;
  onChangeGenres: (genres: string) => void;
};

export default function Sidebar({
  open,
  selectedGenres,
  watchlistOnly,
  onToggleWatchlistOnly,
  onChangeGenres,
}: Props) {
  const selectedSet = useMemo(() => {
    return new Set(selectedGenres.split(",").filter(Boolean));
  }, [selectedGenres]);

  const watchlist = getWatchlist();
  const watched = getWatchedlist();

  const toggleGenre = (id: number) => {
    const current = new Set(selectedSet);

    if (current.has(String(id))) {
      current.delete(String(id));
    } else {
      current.add(String(id));
    }

    onChangeGenres(Array.from(current).join(","));
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <h3 style={{ marginBottom: 12 }}>Genres</h3>

      {GENRES.map((g) => {
        const active = selectedSet.has(String(g.id));

        return (
          <label
            key={g.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={active}
              onChange={() => toggleGenre(g.id)}
            />
            {g.name}
          </label>
        );
      })}



      <hr style={{ margin: "20px 0", borderColor: "#222" }} />

      <h3 style={{ marginBottom: 12 }}>
        Watchlist ({watchlist.length})
      </h3>
    
      <label
        className="genre-item"
        style={{ marginBottom: 18 }}
      >
        <input
          type="checkbox"
          checked={watchlistOnly}
          onChange={onToggleWatchlistOnly}
        />
        <span>Show only watchlist</span>
      </label>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {watchlist.length === 0 ? (
          <p style={{ color: "#777", fontSize: 13 }}>
            No saved movies
          </p>
        ) : (
          watchlist.map((movie) => (
            <Link
              key={movie.id}
              to={`/movie/${movie.id}`}
              style={{
                color: "#ccc",
                textDecoration: "none",
                fontSize: 13,
                lineHeight: 1.4,
              }}
            >
              • {movie.title}
            </Link>
          ))
        )}
      </div>

      <h3>Watched ({watched.length})</h3>

      {watched.length === 0 ? (
        <p style={{ fontSize: 12, color: "#777" }}>No watched movies</p>
      ) : (
        watched.map((m) => (
          <Link key={m.id} to={`/movie/${m.id}`}>
            • {m.title}
            {m.note ? ` (note: ${m.note})` : ""}
          </Link>
        ))
      )}

    </aside>
  );
}