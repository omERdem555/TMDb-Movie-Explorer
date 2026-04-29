import { Router } from "express";
import {
  getPopular,
  getTopRated,
  getUpcoming,
  getMovieDetail,
  search,
} from "../controllers/movies.controller";

const router = Router();

router.get("/popular", getPopular);
router.get("/top-rated", getTopRated);
router.get("/upcoming", getUpcoming);
router.get("/search", search);
router.get("/:id", getMovieDetail);

export default router;