import { Request, Response } from "express";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  getMovieById,
  searchMovies,
} from "../services/tmdb.service";

import { mapMovie } from "../utils/mapper";
import { createError } from "../utils/error";

/**
 * Shared validators
 */
const validatePage = (page: unknown) => {
  const parsed = Number(page) || 1;

  if (!Number.isInteger(parsed) || parsed < 1) {
    return {
      valid: false,
      value: 1,
    };
  }

  return {
    valid: true,
    value: parsed,
  };
};

const getSafeId = (id: string | string[] | undefined) => {
  if (!id) return null;
  return Array.isArray(id) ? id[0] : id;
};

/**
 * DISCOVER (popular / top_rated / upcoming)
 */
export const discoverMovies = async (req: Request, res: Response) => {
  try {
    const type = String(req.query.type || "popular");
    const { value: page, valid } = validatePage(req.query.page);

    if (!valid) {
      return res
        .status(400)
        .json(createError("INVALID_QUERY", "page must be a positive integer"));
    }

    let data;

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
        return res
          .status(400)
          .json(
            createError(
              "INVALID_TYPE",
              "type must be popular, top_rated, or upcoming"
            )
          );
    }

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
        message: "Failed to discover movies",
      },
    });
  }
};

/**
 * MOVIE DETAIL
 */
export const getMovieDetail = async (req: Request, res: Response) => {
  try {
    const id = getSafeId(req.params.id);

    if (!id || isNaN(Number(id))) {
      return res
        .status(400)
        .json(createError("INVALID_PARAM", "valid movie id is required"));
    }

    const data = await getMovieById(id);

    res.status(200).json({
      success: true,
      data: {
        id: data.id,
        title: data.title,
        overview: data.overview,
        genres: data.genres,
        runtime: data.runtime,
        releaseDate: data.release_date,
        rating: Number(data.vote_average.toFixed(1)),
        posterUrl: data.poster_path
          ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
          : null,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: {
        code: "TMDB_FETCH_ERROR",
        message: "Failed to fetch movie detail",
      },
    });
  }
};

/**
 * SEARCH
 */
export const search = async (req: Request, res: Response) => {
  try {
    const query = String(req.query.query || "").trim();
    const type = String(req.query.type || "popular");
    const page = Number(req.query.page) || 1;

    if (!query) {
      return res.status(400).json({
        success: false,
        error: {
          code: "INVALID_QUERY",
          message: "search query is required",
        },
      });
    }

    const data = await searchMovies(query, page, type);

    res.status(200).json({
      success: true,
      page: data.page,
      totalPages: data.total_pages,
      data: data.results,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      error: {
        code: "TMDB_FETCH_ERROR",
        message: "Failed to search movies",
      },
    });
  }
};