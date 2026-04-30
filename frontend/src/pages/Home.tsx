import { useState } from "react";
import { useMovies } from "../hooks/useMovies";
import MovieGrid from "../components/MovieGrid";

export default function Home() {
  const [type, setType] = useState("popular");
  const [page, setPage] = useState(1);

  const { data, loading, error } = useMovies(type, page);

  const handleTypeChange = (newType: string) => {
    setType(newType);
    setPage(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>TMDb Movie Explorer</h1>

      <div
        style={{
          marginBottom: "20px",
          display: "flex",
          gap: "10px",
          flexWrap: "wrap",
        }}
      >
        <button onClick={() => handleTypeChange("popular")}>Popular</button>
        <button onClick={() => handleTypeChange("top_rated")}>
          Top Rated
        </button>
        <button onClick={() => handleTypeChange("upcoming")}>
          Upcoming
        </button>
      </div>

      <p>
        Category: <strong>{type}</strong> | Page: <strong>{page}</strong>
      </p>

      {loading && <div>Loading movies...</div>}

      {error && <div>Error: {error}</div>}

      {!loading && !error && <MovieGrid movies={data} />}

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "10px",
          justifyContent: "center",
        }}
      >
        <button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </button>

        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
}