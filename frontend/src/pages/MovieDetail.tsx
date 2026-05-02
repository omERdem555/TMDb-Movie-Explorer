import { useEffect, useState } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { fetchMovieDetail } from "../api/movies.api";

type MovieDetailData = {
  id: number;
  title: string;
  overview: string;
  genres: { id: number; name: string }[];
  runtime: number;
  releaseDate: string;
  rating: number;
  posterUrl: string | null;

  // NEW
  cast?: {
    id: number;
    name: string;
    character: string;
    profileUrl: string | null;
  }[];
};

export default function MovieDetail() {
  const { id } = useParams();
const location = useLocation();

const params = new URLSearchParams(location.search);

const backLink = decodeURIComponent(
  params.get("from") || "/?type=popular&page=1"
);

  const [movie, setMovie] = useState<MovieDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!id) {
          setError("Movie ID not found");
          return;
        }

        const res = await fetchMovieDetail(id);

        // 🔥 DEBUG BURADA
        console.log("MOVIE DETAIL RAW:", res);

        setMovie(res);
      } catch (err) {
        setError("Failed to load movie detail");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading movie detail...</div>;
  }

  if (error) {
    return <div style={{ padding: "20px" }}>Error: {error}</div>;
  }

  if (!movie) {
    return <div style={{ padding: "20px" }}>Movie not found</div>;
  }

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <Link
        to={backLink}
        style={{
          display: "inline-block",
          marginBottom: "20px",
          color: "#bebebe",
          textDecoration: "none",
        }}
      >
        ← Back
      </Link>

      <div style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
        {movie.posterUrl ? (
          <img
            src={movie.posterUrl}
            alt={movie.title}
            style={{
              width: "300px",
              borderRadius: "8px",
            }}
          />
        ) : (
          <div
            style={{
              width: "300px",
              height: "450px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#eee",
            }}
          >
            No Image
          </div>
        )}

        <div style={{ flex: 1 }}>
          <h1>{movie.title}</h1>

          <p>
            <strong>Rating:</strong> ⭐ {movie.rating}
          </p>

          <p>
            <strong>Runtime:</strong> {movie.runtime} min
          </p>

          <p>
            <strong>Release Date:</strong> {movie.releaseDate}
          </p>

          <p>
            <strong>Genres:</strong>{" "}
            {movie.genres.map((genre) => genre.name).join(", ")}
          </p>

          <p>
            <strong>Overview:</strong> {movie.overview}
              {movie.cast && movie.cast.length > 0 && (
                <div style={{ marginTop: 30 }}>
                  <h3>Featured Cast</h3>

                  <div
                    style={{
                      display: "flex",
                      gap: 16,
                      overflowX: "auto",
                      paddingTop: 10,
                    }}
                  >
                    {movie.cast.map((actor) => (
                      <div
                        key={actor.id}
                        style={{
                          minWidth: 100,
                          textAlign: "center",
                        }}
                      >
                        <img
                          src={
                            actor.profileUrl ||
                            "https://via.placeholder.com/80x80?text=No+Image"
                          }
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />

                        <div style={{ fontSize: 12, marginTop: 6 }}>
                          {actor.name}
                        </div>

                        <div style={{ fontSize: 10, color: "#aaa" }}>
                          {actor.character}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
          </p>
        </div>
      </div>
    </div>
  );
}