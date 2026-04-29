import { Request, Response } from "express";
import { getPopularMovies } from "../services/tmdb.service";

export const getPopular = async (req: Request, res: Response) => {
  try {
    const data = await getPopularMovies();

    res.status(200).json({
      success: true,
      data: data.results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular movies",
    });
  }
};