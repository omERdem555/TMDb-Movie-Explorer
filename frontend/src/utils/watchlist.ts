export type WatchlistMovie = {
  id: number;
  title: string;
  posterUrl: string | null;
};

const WATCHLIST_KEY = "watchlist";

export const getWatchlist = (): WatchlistMovie[] => {
  const stored = localStorage.getItem(WATCHLIST_KEY);

  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
};

export const isInWatchlist = (id: number) => {
  return getWatchlist().some((movie) => movie.id === id);
};

export const toggleWatchlist = (movie: WatchlistMovie) => {
  const current = getWatchlist();

  const exists = current.some((m) => m.id === movie.id);

  let updated;

  if (exists) {
    updated = current.filter((m) => m.id !== movie.id);
  } else {
    updated = [...current, movie];
  }

  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updated));

  return updated;
};