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
 * POPULAR
 */
export const getPopular = async (req: Request, res: Response) => {
  try {
    const { value: page, valid } = validatePage(req.query.page);

    if (!valid) {
      return res
        .status(400)
        .json(createError("INVALID_QUERY", "page must be a positive integer"));
    }

    const data = await getPopularMovies(page);

    res.status(200).json({
      success: true,
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
        message: "Failed to fetch popular movies",
      },
    });
  }
};

/**
 * TOP RATED
 */
export const getTopRated = async (req: Request, res: Response) => {
  try {
    const { value: page } = validatePage(req.query.page);

    const data = await getTopRatedMovies(page);

    res.status(200).json({
      success: true,
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
        message: "Failed to fetch top rated movies",
      },
    });
  }
};

/**
 * UPCOMING
 */
export const getUpcoming = async (req: Request, res: Response) => {
  try {
    const { value: page } = validatePage(req.query.page);

    const data = await getUpcomingMovies(page);

    res.status(200).json({
      success: true,
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
        message: "Failed to fetch upcoming movies",
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
        rating: data.vote_average,
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
    const { value: page } = validatePage(req.query.page);

    if (!query) {
      return res
        .status(400)
        .json(createError("INVALID_QUERY", "search query is required"));
    }

    const data = await searchMovies(query, page);

    res.status(200).json({
      success: true,
      page: data.page,
      totalPages: data.total_pages,
      query,
      data: data.results.map(mapMovie),
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