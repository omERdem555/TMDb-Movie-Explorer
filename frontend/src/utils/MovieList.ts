export type SavedMovie = {
  id: number;
  title: string;
  posterUrl: string | null;
};

export type WatchedMovie = SavedMovie & {
  note: string;
};

const WATCHLIST_KEY = "watchlist";
const WATCHED_KEY = "watchedlist";

/* =========================
   WATCHLIST
========================= */
export const getWatchlist = (): SavedMovie[] => {
  return JSON.parse(localStorage.getItem(WATCHLIST_KEY) || "[]");
};

export const isInWatchlist = (id: number) => {
  return getWatchlist().some((m) => m.id === id);
};

export const toggleWatchlist = (movie: SavedMovie) => {
  const current = getWatchlist();

  const exists = current.some((m) => m.id === movie.id);

  const updated = exists
    ? current.filter((m) => m.id !== movie.id)
    : [...current, movie];

  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));

  return !exists;
};

/* =========================
   WATCHED
========================= */
export const getWatchedlist = (): WatchedMovie[] => {
  return JSON.parse(localStorage.getItem(WATCHED_KEY) || "[]");
};

export const isInWatchedlist = (id: number) => {
  return getWatchedlist().some((m) => m.id === id);
};

export const addToWatched = (movie: SavedMovie, note: string) => {
  // watchlist'ten kaldır
  const watchlist = getWatchlist().filter((m) => m.id !== movie.id);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));

  // watched içine ekle (overwrite yok)
  const watched = getWatchedlist().filter((m) => m.id !== movie.id);

  watched.push({
    ...movie,
    note: note || "",
  });

  localStorage.setItem(WATCHED_KEY, JSON.stringify(watched));
};

export const removeFromWatched = (id: number) => {
  const updated = getWatchedlist().filter((m) => m.id !== id);
  localStorage.setItem(WATCHED_KEY, JSON.stringify(updated));
};

export const getWatchedNote = (id: number) => {
  return getWatchedlist().find((m) => m.id === id)?.note || "";
};