import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Header() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const activeType = searchParams.get("type") || "popular";
  const urlSearch = searchParams.get("search") || "";

  const [query, setQuery] = useState(urlSearch);
  const [isTyping, setIsTyping] = useState(false);

  // URL değişirse input sync
  useEffect(() => {
    setQuery(urlSearch);
  }, [urlSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/?type=${activeType}&search=${encodeURIComponent(query)}`);
    setIsTyping(false);
  };

  const clearSearch = () => {
    setQuery("");
    navigate(`/?type=${activeType}`);
  };

  const linkStyle = (type: string) => ({
    fontWeight: activeType === type ? "bold" : "normal",
    textDecoration: activeType === type ? "underline" : "none",
  });

  return (
    <header
      style={{
        padding: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 16,
        borderBottom: "1px solid #222",
      }}
    >
      {/* BRAND */}
      <Link to="/?type=popular">TMDb Explorer</Link>

      {/* NAV */}
      <Link to="/?type=popular" style={linkStyle("popular")}>
        Popular
      </Link>

      <Link to="/?type=top_rated" style={linkStyle("top_rated")}>
        Top Rated
      </Link>

      <Link to="/?type=upcoming" style={linkStyle("upcoming")}>
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
          position: "relative",
        }}
      >
        <div style={{ position: "relative" }}>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsTyping(true);
            }}
            onBlur={() => setIsTyping(false)}
            placeholder="Search movies..."
            style={{
              padding: "8px 32px 8px 10px",
              borderRadius: 6,
              border: "1px solid #333",
              outline: "none",
            }}
          />

          {/* CLEAR BUTTON */}
          {query.length > 0 && (
            <button
              type="button"
              onClick={clearSearch}
              style={{
                position: "absolute",
                right: 6,
                top: 6,
                border: "none",
                background: "transparent",
                color: "#999",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* INLINE LOADING FEEDBACK */}
        {isTyping && (
          <span style={{ fontSize: 12, color: "#888" }}>
            typing...
          </span>
        )}
      </form>
    </header>
  );
}