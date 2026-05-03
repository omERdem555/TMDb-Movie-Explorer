import { Router } from "express";
import {
  getMovies,
  getMovieDetail,
  searchMovies,
} from "../controllers/movies.controller";


const router = Router();

/**
 * DISCOVER / FILTER / PAGINATION
 * GET /api/movies?type=popular&search=&genres=&page=1
 *
 * Ana listeleme endpointi.
 * Popular / Top Rated / Upcoming + local filtering yapısı
 */
router.get("/", getMovies);

/**
 * DEDICATED SEARCH
 * GET /api/movies/search?query=batman&page=1&type=popular
 *
 * NOT:
 * Bu route 반드시 /:id'den önce gelmeli.
 * Aksi halde "search" stringi id gibi yakalanır.
 */
router.get("/search", searchMovies);

/**
 * MOVIE DETAIL
 * GET /api/movies/:id
 *
 * Tekil film detay endpointi
 */
router.get("/:id", getMovieDetail);

export default router;