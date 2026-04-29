import { Request, Response } from "express";
import { getPopularMovies } from "../services/tmdb.service";
import { mapMovie } from "../utils/mapper";

export const getPopular = async (req: Request, res: Response) => {
  try {
    // 1. query param parsing
    const page = Number(req.query.page) || 1; // default to page 1 if not provided

    // 2. service call with pagination
    const data = await getPopularMovies(page);

    // 3. mapping
    const mapped = data.results.map(mapMovie);

    // 4. response shaping
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