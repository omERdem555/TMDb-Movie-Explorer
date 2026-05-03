import { Request, Response } from "express";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieById,
  getMovieCredits,
  searchMovies as tmdbSearchMovies,
  getSimilarMovies,
} from "../services/tmdb.service";

import { mapMovie } from "../utils/mapper";

const validatePage = (page: unknown) => {
  const parsed = Number(page);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

/**
 * Shared fetcher by category
 */
const fetchMoviesByType = async (type: string, page: number) => {
  switch (type) {
    case "popular":
      return getPopularMovies(page);
    case "top_rated":
      return getTopRatedMovies(page);
    case "upcoming":
      return getUpcomingMovies(page);
    default:
      throw new Error("INVALID_TYPE");
  }
};

/**
 * MAIN DISCOVER / FILTER CONTROLLER
 * /api/movies?type=popular&search=&genres=&page=1
 */
export const getMovies = async (req: Request, res: Response) => {
  try {
    const type = String(req.query.type || "popular");
    const search = String(req.query.search || "").trim().toLowerCase();
    const genres = String(req.query.genres || "");
    const page = validatePage(req.query.page);

    let baseData: any[] = [];

    // 1. TYPE SEÇİMİ
    for (let i = 1; i <= 10; i++) {
      const data = await fetchMoviesByType(type, i);
      baseData.push(...data.results);
    }

    // 2. SEARCH FILTER (TMDB yerine LOCAL)
    if (search.length > 0) {
      baseData = baseData.filter(m =>
        m.title?.toLowerCase().includes(search)
      );
    }

    // 3. GENRE FILTER
    if (genres) {
      const gs = genres.split(",").map(Number).filter(Boolean);

      baseData = baseData.filter(m =>
        gs.every(g => m.genre_ids?.includes(g))
      );
    }

    // 4. PAGINATION
    const PER_PAGE = 20;
    const start = (page - 1) * PER_PAGE;

    return res.json({
      success: true,
      page,
      totalPages: Math.ceil(baseData.length / PER_PAGE),
      data: baseData.slice(start, start + PER_PAGE).map(mapMovie),
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "FETCH_ERROR",
    });
  }
};

/**
 * TRUE TMDB SEARCH ENDPOINT
 * /api/movies/search?query=batman&page=1
 */
export const searchMovies = async (req: Request, res: Response) => {
  try {
    const query = String(req.query.query || "").trim();
    const page = validatePage(req.query.page);

    if (!query) {
      return res.status(400).json({
        success: false,
        error: "MISSING_QUERY",
      });
    }

    const data = await tmdbSearchMovies(query, page);

    return res.json({
      success: true,
      page: data.page,
      totalPages: data.total_pages,
      data: data.results.map(mapMovie),
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "SEARCH_FETCH_ERROR",
    });
  }
};

/**
 * MOVIE DETAIL
 * /api/movies/:id
 */
export const getMovieDetail = async (req: Request, res: Response) => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id || isNaN(Number(id))) {
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

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      error: "DETAIL_FETCH_ERROR",
    });
  }
};