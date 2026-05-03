import { Request, Response } from "express";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieById,
  getMovieCredits,
  searchMovies as tmdbSearchMovies,
  getSimilarMovies,
  multiSearch,
  getPersonMovieCredits
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
    const search = String(req.query.search || "").trim();
    const genres = String(req.query.genres || "");
    const page = validatePage(req.query.page);

    const PER_PAGE = 20;
    let results: any[] = [];

    /**
     * =========================
     * SEARCH MODE (PRIMARY)
     * =========================
     */
    if (search.length > 0) {
      const multi = await multiSearch(search, page);

      let movieResults =
        multi.results?.filter((item: any) => item.media_type === "movie") || [];

      const personResults =
        multi.results?.filter((item: any) => item.media_type === "person") || [];

      /**
       * PERSON → known_for + credits
       */
      let actorMovies: any[] = [];

      for (const person of personResults.slice(0, 3)) {
        /**
         * known_for
         */
        if (person.known_for) {
          actorMovies.push(
            ...person.known_for.filter(
              (k: any) => k.media_type === "movie"
            )
          );
        }

        /**
         * movie credits
         */
        const credits = await getPersonMovieCredits(person.id);

        if (credits.cast) {
          actorMovies.push(...credits.cast);
        }
      }

      /**
       * MERGE
       * Film title direct matches first
       */
      let combinedResults = [...movieResults, ...actorMovies];

      /**
       * DEDUPLICATE by movie id
       */
      const uniqueMap = new Map();

      combinedResults.forEach((movie) => {
        if (movie?.id && !uniqueMap.has(movie.id)) {
          uniqueMap.set(movie.id, movie);
        }
      });

      results = Array.from(uniqueMap.values());

      /**
       * TYPE SORT
       */
      switch (type) {
        case "popular":
          results.sort(
            (a: any, b: any) =>
              (b.popularity || 0) - (a.popularity || 0)
          );
          break;

        case "top_rated":
          results.sort(
            (a: any, b: any) =>
              (b.vote_average || 0) - (a.vote_average || 0)
          );
          break;

        case "upcoming":
          results = results.filter(
            (m: any) =>
              m.release_date &&
              new Date(m.release_date) > new Date()
          );

          results.sort(
            (a: any, b: any) =>
              new Date(a.release_date).getTime() -
              new Date(b.release_date).getTime()
          );
          break;

        default:
          return res.status(400).json({
            success: false,
            error: "INVALID_TYPE",
          });
      }

      /**
       * GENRE FILTER
       */
      if (genres) {
        const gs = genres
          .split(",")
          .map(Number)
          .filter(Boolean);

        results = results.filter((m: any) =>
          gs.every((g) => m.genre_ids?.includes(g))
        );
      }

      /**
       * LOCAL PAGINATION
       */
      const start = (page - 1) * PER_PAGE;
      const paginated = results.slice(start, start + PER_PAGE);

      return res.json({
        success: true,
        page,
        totalPages: Math.ceil(results.length / PER_PAGE),
        data: paginated.map(mapMovie),
      });
    }

    /**
     * =========================
     * NORMAL DISCOVER MODE
     * =========================
     */
    const data = await fetchMoviesByType(type, page);

    results = data.results;

    /**
     * GENRE FILTER (LOCAL)
     */
    if (genres) {
      const MAX_PAGES = 20;
      let allResults: any[] = [];

      for (let i = 1; i <= MAX_PAGES; i++) {
        const pageData = await fetchMoviesByType(type, i);
        allResults.push(...pageData.results);
      }

      const selectedGenres = genres
        .split(",")
        .map(Number)
        .filter(Boolean);

      results = allResults.filter((movie) =>
        selectedGenres.every((g) => movie.genre_ids?.includes(g))
      );

      const start = (page - 1) * PER_PAGE;
      const paginated = results.slice(start, start + PER_PAGE);

      return res.json({
        success: true,
        page,
        totalPages: Math.ceil(results.length / PER_PAGE),
        data: paginated.map(mapMovie),
      });
    }

    return res.json({
      success: true,
      page: data.page,
      totalPages: data.total_pages,
      data: results.map(mapMovie),
    });

  } catch (err) {
    console.error("GET_MOVIES_ERROR:", err);

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