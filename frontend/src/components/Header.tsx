import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeType = searchParams.get("type") || "popular";
  const urlSearch = searchParams.get("search") || "";

  const [query, setQuery] = useState(urlSearch);
  const [searching, setSearching] = useState(false);

  // URL → input sync
  useEffect(() => {
    setQuery(urlSearch);
  }, [urlSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setSearching(true);

    // boşsa search temizlenir ama type korunur
    if (!query.trim()) {
      navigate(`/?type=${activeType}&page=1`);
      setTimeout(() => setSearching(false), 300);
      return;
    }

    // 🔥 KRİTİK FIX:
    // type + search + page birlikte korunur
    navigate(
      `/?type=${activeType}&search=${encodeURIComponent(
        query
      )}&page=1`
    );

    setTimeout(() => setSearching(false), 300);
  };

  const clearSearch = () => {
    setQuery("");
    navigate(`/?type=${activeType}&page=1`);
  };

  const linkStyle = (type: string) => ({
    fontWeight: activeType === type ? "bold" : "normal",
    textDecoration: activeType === type ? "underline" : "none",
    color: "white",
  });

  return (
    <header
      style={{
        padding: "16px 24px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        borderBottom: "1px solid #222",
        position: "sticky",
        top: 0,
        background: "#111",
        zIndex: 100,
      }}
    >
      {/* BRAND */}
      <Link
        to="/?type=popular&page=1"
        style={{ color: "white", textDecoration: "none" }}
      >
        TMDb Explorer
      </Link>

      {/* NAV */}
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
        <div style={{ position: "relative" }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies..."
            style={{
              padding: "8px 32px 8px 12px",
              borderRadius: 6,
              border: "1px solid #333",
              background: "#1a1a1a",
              color: "white",
            }}
          />

          {/* CLEAR BUTTON */}
          {query.length > 0 && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                position: "absolute",
                right: 8,
                top: "50%",
                transform: "translateY(-50%)",
                border: "none",
                background: "transparent",
                color: "#aaa",
                cursor: "pointer",
                fontSize: 14,
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* INLINE SEARCH FEEDBACK */}
        {searching && (
          <span style={{ fontSize: 12, color: "#888" }}>
            searching...
          </span>
        )}
      </form>
    </header>
  );
}