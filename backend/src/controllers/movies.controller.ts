import { Request, Response } from "express";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovies,
} from "../services/tmdb.service";

import { mapMovie } from "../utils/mapper";

const validatePage = (page: unknown) => {
  const parsed = Number(page);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

export const getMovies = async (req: Request, res: Response) => {
  try {
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

    // GENRE FILTER
    if (genres) {
      const selectedGenres = genres
        .split(",")
        .map(Number)
        .filter(Boolean);

      results = results.filter((movie: any) =>
        selectedGenres.every((g) => movie.genre_ids?.includes(g))
      );
    }

    res.json({
      success: true,
      page: data.page,
      totalPages: data.total_pages,
      data: results.map(mapMovie),
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      error: "FETCH_ERROR",
    });
  }
};