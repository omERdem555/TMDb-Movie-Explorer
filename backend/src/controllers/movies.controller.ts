import { Request, Response } from "express";
import { getPopularMovies } from "../services/tmdb.service";
import { mapMovie } from "../utils/mapper";
import { createError } from "../utils/error";

export const getPopular = async (req: Request, res: Response) => {
  try {
    // 1. raw input
    const pageRaw = req.query.page;

    // 2. validation
    const page = Number(pageRaw) || 1;

    if (!Number.isInteger(page) || page < 1) {
    return res.status(400).json(
        createError("INVALID_QUERY", "page must be a positive integer")
    );
    }

    // 3. service
    const data = await getPopularMovies(page);

    // 4. mapping
    const mapped = data.results.map(mapMovie);

    // 5. response
    res.status(200).json({
      success: true,
      page: data.page,
      totalPages: data.total_pages,
      data: mapped,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: {
        code: "TMDB_FETCH_ERROR",
        message: "Failed to fetch popular movies",
      },
    });
  }
};