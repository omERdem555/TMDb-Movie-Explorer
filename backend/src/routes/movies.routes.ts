import { Router } from "express";
import {
  getMovies,
  getMovieDetail,
} from "../controllers/movies.controller";

const router = Router();

/**
 * UNIFIED MOVIES ENDPOINT
 * /api/movies?type=popular&search=&genres=&page=1
 */
router.get("/", getMovies);
router.get("/:id", getMovieDetail);

export default router;