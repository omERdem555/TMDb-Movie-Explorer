import { GENRES } from "../constants/genres";
import { useMemo, useState } from "react";
import {
  getWatchlist,
  getWatchedlist,
} from "../utils/MovieList";
import { Link } from "react-router-dom";

export default function Sidebar({
  open,
  selectedGenres,
  watchlistOnly,
  onToggleWatchlistOnly,
  onChangeGenres,
}: any) {
  const [activeNote, setActiveNote] = useState<number | null>(null);

  const selectedSet = useMemo(
    () => new Set(selectedGenres.split(",").filter(Boolean)),
    [selectedGenres]
  );

  const watchlist = getWatchlist();
  const watched = getWatchedlist();

  const toggleGenre = (id: number) => {
    const current = new Set(selectedSet);

    current.has(String(id))
      ? current.delete(String(id))
      : current.add(String(id));

    onChangeGenres(Array.from(current).join(","));
  };

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <h3>Genres</h3>

      {GENRES.map((g) => (
        <label key={g.id} className="genre-item">
          <input
            type="checkbox"
            checked={selectedSet.has(String(g.id))}
            onChange={() => toggleGenre(g.id)}
          />
          {g.name}
        </label>
      ))}

      <hr />

      <h3>Watchlist ({watchlist.length})</h3>

      {watchlist.map((m) => (
        <div key={m.id} className="sidebar-item">
          <Link to={`/movie/${m.id}`}>• {m.title}</Link>
        </div>
      ))}


      <label className="genre-item">
        <input
          type="checkbox"
          checked={watchlistOnly}
          onChange={onToggleWatchlistOnly}
        />
        Show only watchlist
      </label>

      <h3>Watched ({watched.length})</h3>

      {watched.map((m) => (
        <div key={m.id} className="sidebar-item">
          
          {/* film link */}
          <Link to={`/movie/${m.id}`}>• {m.title}</Link>

          {/* note toggle */}
          <button
            onClick={() =>
              setActiveNote(activeNote === m.id ? null : m.id)
            }
            className="note-btn"
          >
            note
          </button>

          {/* note panel */}
          {activeNote === m.id && m.note && (
            <div className="note-box">
              {m.note}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}