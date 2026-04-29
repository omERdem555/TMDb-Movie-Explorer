import { Request, Response } from "express";
import { getPopularMovies } from "./services/tmdb.service";
import { mapMovie } from "./utils/mapper";

export const getPopular = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;

  if (!Number.isInteger(page) || page < 1) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_QUERY",
        message: "page must be a positive integer",
      },
    });
  }

  const data = await getPopularMovies(page);

  const mapped = data.results.map(mapMovie);

  res.json({
    success: true,
    page: data.page,
    totalPages: data.total_pages,
    data: mapped,
  });
};