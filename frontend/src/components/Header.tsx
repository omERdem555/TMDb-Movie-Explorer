import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = query.trim();

    if (!trimmed) return;

    navigate(`/?search=${encodeURIComponent(trimmed)}`);
  };

  return (
    <header
      style={{
        padding: "15px 30px",
        borderBottom: "1px solid #ddd",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "15px",
      }}
    >
      <nav
        style={{
          display: "flex",
          gap: "15px",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <Link to="/" style={{ fontWeight: "bold", fontSize: "20px" }}>
          TMDb Explorer
        </Link>

        <Link to="/?type=popular">Popular</Link>

        <Link to="/?type=top_rated">Top Rated</Link>

        <Link to="/?type=upcoming">Upcoming</Link>
      </nav>

      <form
        onSubmit={handleSearch}
        style={{
          display: "flex",
          gap: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: "8px",
            minWidth: "220px",
          }}
        />

        <button type="submit">Search</button>
      </form>
    </header>
  );
}