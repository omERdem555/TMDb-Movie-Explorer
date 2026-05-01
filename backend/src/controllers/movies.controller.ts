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
    const search = String(req.query.search || "").trim();
    const genres = String(req.query.genres || "");
    const page = validatePage(req.query.page);

    let data;

    // 1. SEARCH FIRST PRIORITY
    if (search.length > 0) {
      data = await searchMovies(search, page);
    }

    // 2. OTHERWISE TYPE BASED
    else {
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
    }

    // 3. UNIFIED RESPONSE
    res.json({
      success: true,
      page: data.page,
      totalPages: data.total_pages,
      data: data.results.map(mapMovie),
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      error: "FETCH_ERROR",
    });
  }
};