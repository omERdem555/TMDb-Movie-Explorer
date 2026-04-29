import { Request, Response } from "express";
import { getPopularMovies } from "../services/tmdb.service";
import { mapMovie } from "../utils/mapper";

export const getPopular = async (req: Request, res: Response) => {
  try {
    const data = await getPopularMovies();

    const mapped = data.results.map(mapMovie);

    res.status(200).json({
      success: true,
      data: mapped,
    });
  } catch (error) {
  console.log("ERROR:", error);
  
  res.status(500).json({
    success: false,
    message: "Failed to fetch popular movies",
  });
}
};