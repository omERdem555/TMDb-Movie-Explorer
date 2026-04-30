import { Router } from "express";
import {
  discoverMovies,
  getMovieDetail,
  search,
} from "../controllers/movies.controller";

const router = Router();

/**
 * DISCOVER
 * /api/movies/discover?type=popular
 */
router.get("/discover", discoverMovies);

/**
 * SEARCH
 * /api/movies/search?query=batman
 */
router.get("/search", search);

/**
 * DETAIL
 * /api/movies/123
 */
router.get("/:id", getMovieDetail);

export default router;