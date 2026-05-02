import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeType = searchParams.get("type") || "popular";
  const urlSearch = searchParams.get("search") || "";

  const [query, setQuery] = useState(urlSearch);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setQuery(urlSearch);
  }, [urlSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setSearching(true);

    if (!query.trim()) {
      navigate(`/?type=${activeType}&page=1`);
      setTimeout(() => setSearching(false), 300);
      return;
    }

    navigate(
      `/?type=${activeType}&search=${encodeURIComponent(query)}&page=1`
    );

    setTimeout(() => setSearching(false), 300);
  };

  const clearSearch = () => {
    setQuery("");
    navigate(`/?type=${activeType}&page=1`);
  };

  const toggleSidebar = () => {
    window.dispatchEvent(new Event("toggleSidebar"));
  };

  const linkStyle = (type: string) => ({
    fontWeight: activeType === type ? "bold" : "normal",
    textDecoration: activeType === type ? "underline" : "none",
    color: "white",
  });

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 64,
        zIndex: 1000,
        background: "#111",
        display: "flex",
        alignItems: "center",
        padding: "10px 16px",
        gap: 12,
      }}
    >
      {/* MOBILE MENU BUTTON */}
      <button
        onClick={toggleSidebar}
        className="mobile-menu-btn"
      >
        ☰
      </button>

      {/* BRAND */}
      <Link to="/?type=popular&page=1" style={{ color: "white" }}>
        TMDb Explorer
      </Link>

      <Link to="/?type=popular&page=1" style={linkStyle("popular")}>
        Popular
      </Link>

      <Link to="/?type=top_rated&page=1" style={linkStyle("top_rated")}>
        Top Rated
      </Link>

      <Link to="/?type=upcoming&page=1" style={linkStyle("upcoming")}>
        Upcoming
      </Link>

      {/* SEARCH */}
      <form
        onSubmit={handleSearch}
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
          style={{
            borderRadius: 6,
            border: "1px solid #333",
            background: "#1a1a1a",
            color: "white"
          }}
        />

        {query && (
          <button
            type="button"
            onClick={clearSearch}
            style={{ background: "transparent", color: "#aaa" }}
          >
            ✕
          </button>
        )}

        {searching && <span style={{ color: "#888" }}>...</span>}
      </form>
    </header>
  );
}