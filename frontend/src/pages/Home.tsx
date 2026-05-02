import { useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import MovieGrid from "../components/MovieGrid";
import { useMovieQuery } from "../hooks/useMovieQuery";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import MovieCardSkeleton from "../components/skeleton/MovieCardSkeleton";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();

  const type = searchParams.get("type") || "popular";
  const search = searchParams.get("search") || "";
  const page = Number(searchParams.get("page") || 1);
  const genres = searchParams.get("genres") || "";

  const { data, loading, error } = useMovieQuery(type, genres, search, page);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handler = () => setSidebarOpen((prev) => !prev);
    window.addEventListener("toggleSidebar", handler);
    return () => window.removeEventListener("toggleSidebar", handler);
  }, []);

  return (
    <div className="app-layout">
      <Header />

      <Sidebar
        open={sidebarOpen}
        selectedGenres={genres}
        onChangeGenres={(newGenres) => {
          setSearchParams((prev) => {
            const next = new URLSearchParams(prev);
            next.set("genres", newGenres);
            next.set("page", "1");
            return next;
          });
        }}
      />

      {/* MAIN AREA */}
      <main>
        {error && (
          <ErrorState
            message={error}
            onRetry={() => window.location.reload()}
          />
        )}

        {/* EMPTY STATE */}
        {!loading && !error && data.length === 0 && (
          <EmptyState
            type={type}
            search={search}
            genres={genres}
          />
        )}

        {/* LOADING STATE → SKELETON */}
        {loading ? (
          <div className="movie-grid">
            {Array.from({ length: 20 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <MovieGrid movies={data} loading={loading} />
        )}

        {/* PAGINATION */}
        {!loading && data.length > 0 && (
          <div className="pagination">
            <button
              className="page-btn"
              onClick={() =>
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.set("page", String(Math.max(1, page - 1)));
                  return next;
                })
              }
              disabled={page === 1}
            >
              ← Prev
            </button>

            <span className="page-indicator">Page {page}</span>

            <button
              className="page-btn"
              onClick={() =>
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  next.set("page", String(page + 1));
                  return next;
                })
              }
            >
              Next →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}