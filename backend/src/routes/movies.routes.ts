import { Router } from "express";
import { discoverMovies } from "../controllers/movies.controller";

const router = Router();

/**
 * Single unified endpoint
 */
router.get("/discover", discoverMovies);

export default router;