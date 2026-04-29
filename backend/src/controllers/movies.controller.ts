import { Request, Response } from "express";
import { getMoviesByType } from "../services/tmdb.service";
import { mapMovie } from "../utils/mapper";
import { createError } from "../utils/error";

const validatePage = (page: unknown) => {
  const parsed = Number(page) || 1;

  if (!Number.isInteger(parsed) || parsed < 1) {
    return { valid: false, value: 1 };
  }

  return { valid: true, value: parsed };
};

export const discoverMovies = async (req: Request, res: Response) => {
  try {
    const type = String(req.query.type || "popular");
    const { value: page, valid } = validatePage(req.query.page);

    if (!valid) {
      return res
        .status(400)
        .json(createError("INVALID_QUERY", "page must be a positive integer"));
    }

    const data = await getMoviesByType(type, page);

    res.status(200).json({
      success: true,
      type,
      page: data.page,
      totalPages: data.total_pages,
      data: data.results.map(mapMovie),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: {
        code: "TMDB_FETCH_ERROR",
        message: "Failed to fetch movies",
      },
    });
  }
};