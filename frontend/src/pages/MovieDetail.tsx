import { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import { fetchMovieDetail } from "../api/movies.api";
import CastSkeleton from "../components/skeleton/CastSkeleton";

type MovieDetailData = {
  id: number;
  title: string;
  overview: string;
  genres: { id: number; name: string }[];
  runtime: number;
  releaseDate: string;
  rating: number;
  posterUrl: string | null;

  cast: {
    id: number;
    name: string;
    character: string;
    profilePath: string | null;
  }[];

  similarMovies: {
  id: number;
  title: string;
  posterUrl: string | null;
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
        setMovie(res);
      } catch {
        setError("Failed to load movie detail");
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (error) return <div style={{ padding: 20 }}>{error}</div>;
  if (!movie) return <div style={{ padding: 20 }}>Not found</div>;

  return (
    <div className="movie-detail-page">
      <Link to={backLink} className="back-link">
        ← Back
      </Link>

      {/* TOP SECTION */}
      <div className="movie-detail-top">
        <img
          className="movie-poster"
          src={movie.posterUrl || ""}
          alt={movie.title}
        />

        <div className="movie-info">
          <h1>{movie.title}</h1>

          <div className="meta">
            ⭐ {movie.rating} · {movie.runtime} min · {movie.releaseDate}
          </div>

          <div className="genres">
            {movie.genres.map((g) => g.name).join(", ")}
          </div>

          <p className="overview">{movie.overview}</p>
        </div>
      </div>

      {/* CAST */}
      <h2 className="cast-title">Cast</h2>

      <div className="cast-grid">
        {movie.cast?.map((c: any) => (
          <div className="cast-card" key={c.id}>
            
            {/* IMAGE WRAPPER - SABİT ALAN */}
            <div className="cast-image">
              {c.profilePath ? (
                <img src={c.profilePath} alt={c.name} />
              ) : (
                <div className="no-image">
                  No Image
                </div>
              )}
            </div>

            {/* TEXT */}
            <div className="cast-name">{c.name}</div>
            <div className="cast-char">{c.character}</div>

          </div>
        ))}
      </div>

      {/*SİMİLAR*/}
      <h2 className="cast-title">Similar Movies</h2>

      <div className="similar-grid">
        {movie.similarMovies.map((similar) => (
          <Link
            key={similar.id}
            to={`/movie/${similar.id}?from=${encodeURIComponent(
              location.pathname + location.search
            )}`}
            className="similar-link"
          >
            <img
              src={
                similar.posterUrl ||
                "https://via.placeholder.com/300x450?text=No+Image"
              }
              alt={similar.title}
              className="similar-poster"
            />
          </Link>
        ))}
      </div>
    </div>
  );
}