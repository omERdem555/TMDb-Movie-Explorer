import { Router } from "express";
import { getMovies } from "../controllers/movies.controller";

const router = Router();

/**
 * UNIFIED MOVIES ENDPOINT
 * /api/movies?type=popular&search=&genres=&page=1
 */
router.get("/", getMovies);

export default router;