import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getMovieById,
  getMovieCredits,
  getSimilarMovies,
} from "../../services/tmdb.service";
import { mapMovie } from "../../utils/mapper";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Debug logging
  console.log("API Key available:", !!process.env.TMDB_API_KEY);
  console.log("Request ID:", id);

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  try {
    // Validate API Key
    if (!process.env.TMDB_API_KEY) {
      console.error("CRITICAL: TMDB_API_KEY is not set!");
      return res.status(500).json({
        success: false,
        error: "API_KEY_MISSING",
        message: "TMDB_API_KEY environment variable is not configured",
      });
    }

    const { id } = req.query;

    if (!id || Array.isArray(id) || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        error: "INVALID_ID",
      });
    }

    const [movie, credits, similar] = await Promise.all([
      getMovieById(id),
      getMovieCredits(id),
      getSimilarMovies(id),
    ]);

    return res.json({
      success: true,
      data: {
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        genres: movie.genres,
        runtime: movie.runtime,
        releaseDate: movie.release_date,
        rating: Number(movie.vote_average.toFixed(1)),
        posterUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : null,

        cast: credits.cast.slice(0, 12).map((c: any) => ({
          id: c.id,
          name: c.name,
          character: c.character,
          profilePath: c.profile_path
            ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
            : null,
        })),
        similarMovies: similar.results.slice(0, 8).map(mapMovie),
      },
    });
  } catch (err: any) {
    console.error("DETAIL_FETCH_ERROR:", err?.message || err);
    console.error("Error details:", {
      code: err?.code,
      response: err?.response?.status,
      data: err?.response?.data,
    });

    return res.status(500).json({
      success: false,
      error: "DETAIL_FETCH_ERROR",
      details: err?.message || "Unknown error",
    });
  }
}
