import { VercelRequest, VercelResponse } from "@vercel/node";
import {
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "./services/tmdb.service";
import { mapMovie } from "./utils/mapper";

const validatePage = (page: unknown) => {
  const parsed = Number(page);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (!process.env.TMDB_API_KEY) {
      return res.status(500).json({
        success: false,
        data: [],
        error: "API_KEY_MISSING",
      });
    }

    const type = String(req.query.type || "popular");
    const search = String(req.query.search || "").trim().toLowerCase();
    const genres = String(req.query.genres || "");
    const page = validatePage(req.query.page);

    const fetchByType = async (p: number) => {
      switch (type) {
        case "popular":
          return await getPopularMovies(p);
        case "top_rated":
          return await getTopRatedMovies(p);
        case "upcoming":
          return await getUpcomingMovies(p);
        default:
          throw new Error("INVALID_TYPE");
      }
    };

    let all: any[] = [];

    const MAX = 20; // 20 yerine azalt (perf + vercel limit)

    for (let i = 1; i <= MAX; i++) {
      const d = await fetchByType(i);
      all.push(...d.results);
    }

    if (search) {
      all = all.filter(m =>
        m.title?.toLowerCase().includes(search)
      );
    }

    if (genres) {
      const gs = genres.split(",").map(Number);
      all = all.filter(m =>
        gs.every(g => m.genre_ids?.includes(g))
      );
    }

    const PER_PAGE = 20;
    const start = (page - 1) * PER_PAGE;

    const paginated = all.slice(start, start + PER_PAGE);

    return res.status(200).json({
      success: true,
      data: paginated.map(mapMovie),
    });

  } catch (err: any) {
    return res.status(500).json({
      success: false,
      data: [],
      error: err?.message || "FETCH_ERROR",
    });
  }
}