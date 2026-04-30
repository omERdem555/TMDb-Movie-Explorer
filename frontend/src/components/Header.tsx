import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const activeType = searchParams.get("type") || "popular";

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // 🔥 CRITICAL FIX: type korunuyor
    navigate(
      `/?type=${activeType}&search=${encodeURIComponent(query)}`
    );
  };

  const linkStyle = (type: string) => ({
    fontWeight: activeType === type ? "bold" : "normal",
    textDecoration: activeType === type ? "underline" : "none",
  });

  return (
    <header style={{ padding: 15, display: "flex", gap: 20 }}>
      <Link to="/?type=popular">TMDb Explorer</Link>

      <Link to="/?type=popular" style={linkStyle("popular")}>
        Popular
      </Link>

      <Link to="/?type=top_rated" style={linkStyle("top_rated")}>
        Top Rated
      </Link>

      <Link to="/?type=upcoming" style={linkStyle("upcoming")}>
        Upcoming
      </Link>

      <form onSubmit={handleSearch} style={{ marginLeft: "auto" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies..."
        />
      </form>
    </header>
  );
}