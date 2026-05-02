import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "./services/tmdb.service";
import { mapMovie } from "./utils/mapper";

const validatePage = (page: unknown) => {
  const parsed = Number(page);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

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
  console.log("Request params:", req.query);
  console.log("ENV CHECK:", process.env.TMDB_API_KEY);

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

    const type = String(req.query.type || "popular");
    const search = String(req.query.search || "").trim().toLowerCase();
    const genres = String(req.query.genres || "");
    const page = validatePage(req.query.page);

    let data;

    // =========================
    // SEARCH MODE (TYPE İÇİNDE 20 PAGE FETCH)
    // =========================
    if (search.length > 0) {
      const MAX_PAGES = 20;

      let allResults: any[] = [];

      for (let i = 1; i <= MAX_PAGES; i++) {
        let pageData;

        switch (type) {
          case "popular":
            pageData = await getPopularMovies(i);
            break;

          case "top_rated":
            pageData = await getTopRatedMovies(i);
            break;

          case "upcoming":
            pageData = await getUpcomingMovies(i);
            break;

          default:
            return res.status(400).json({
              success: false,
              error: "INVALID_TYPE",
            });
        }

        allResults.push(...pageData.results);
      }

      // TITLE FILTER
      let filtered = allResults.filter((movie) =>
        movie.title?.toLowerCase().includes(search)
      );

      // GENRE FILTER
      if (genres) {
        const selectedGenres = genres
          .split(",")
          .map(Number)
          .filter(Boolean);

        filtered = filtered.filter((movie) =>
          selectedGenres.every((g) => movie.genre_ids?.includes(g))
        );
      }

      // LOCAL PAGINATION
      const PER_PAGE = 20;
      const start = (page - 1) * PER_PAGE;
      const paginatedResults = filtered.slice(start, start + PER_PAGE);

      return res.json({
        success: true,
        page,
        totalPages: Math.ceil(filtered.length / PER_PAGE),
        data: paginatedResults.map(mapMovie),
      });
    }

    // =========================
    // GENRE ONLY MODE (MULTI PAGE FETCH)
    // =========================
    if (genres) {
      const MAX_PAGES = 20;
      let allResults: any[] = [];

      for (let i = 1; i <= MAX_PAGES; i++) {
        let pageData;

        switch (type) {
          case "popular":
            pageData = await getPopularMovies(i);
            break;

          case "top_rated":
            pageData = await getTopRatedMovies(i);
            break;

          case "upcoming":
            pageData = await getUpcomingMovies(i);
            break;

          default:
            return res.status(400).json({
              success: false,
              error: "INVALID_TYPE",
            });
        }

        allResults.push(...pageData.results);
      }

      const selectedGenres = genres
        .split(",")
        .map(Number)
        .filter(Boolean);

      const filtered = allResults.filter((movie) =>
        selectedGenres.every((g) => movie.genre_ids?.includes(g))
      );

      const PER_PAGE = 20;
      const start = (page - 1) * PER_PAGE;
      const paginatedResults = filtered.slice(start, start + PER_PAGE);

      return res.json({
        success: true,
        page,
        totalPages: Math.ceil(filtered.length / PER_PAGE),
        data: paginatedResults.map(mapMovie),
      });
    }

    // =========================
    // NORMAL DISCOVER MODE
    // =========================
    switch (type) {
      case "popular":
        data = await getPopularMovies(page);
        break;

      case "top_rated":
        data = await getTopRatedMovies(page);
        break;

      case "upcoming":
        data = await getUpcomingMovies(page);
        break;

      default:
        return res.status(400).json({
          success: false,
          error: "INVALID_TYPE",
        });
    }

    let results = data.results;

    res.json({
      success: true,
      page: data.page,
      totalPages: data.total_pages,
      data: results.map(mapMovie),
    });
  } catch (err: any) {
    console.error("FETCH_ERROR:", err?.message || err);
    console.error("Error details:", {
      code: err?.code,
      response: err?.response?.status,
      data: err?.response?.data,
    });

    res.status(500).json({
      success: false,
      error: "FETCH_ERROR",
      details: err?.message || "Unknown error",
    });
  }
}
