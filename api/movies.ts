import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

const rawCredential = process.env.TMDB_API_KEY?.trim() || "";
const normalizedCredential = rawCredential.replace(/^Bearer\s+/i, "");
const isJwtToken = normalizedCredential.split(".").length === 3;

const requestAuth = isJwtToken
  ? { headers: { Authorization: `Bearer ${normalizedCredential}` } }
  : { params: { api_key: normalizedCredential } };

const tmdbClient = axios.create({
  baseURL: BASE_URL,
});

// 1. Popular movies
export const getPopularMovies = async (page: number = 1) => {
  const response = await tmdbClient.get("/movie/popular", {
    ...requestAuth,
    params: {
      ...(requestAuth as any).params,
      page,
    },
  });

  return response.data;
};

export const getTopRatedMovies = async (page: number = 1) => {
  const res = await tmdbClient.get("/movie/top_rated", {
    ...requestAuth,
    params: { ...(requestAuth as any).params, page },
  });

  return res.data;
};

export const getUpcomingMovies = async (page: number = 1) => {
  const res = await tmdbClient.get("/movie/upcoming", {
    ...requestAuth,
    params: { ...(requestAuth as any).params, page },
  });

  return res.data;
};

export const getMovieById = async (id: string) => {
  const res = await tmdbClient.get(`/movie/${id}`, requestAuth);
  return res.data;
};

export const searchMovies = async (
  query: string,
  page: number = 1,
  type?: string
) => {
  const res = await tmdbClient.get("/search/movie", {
    ...requestAuth,
    params: {
      ...(requestAuth as any).params,
      query,
      page,
    },
  });

  return res.data;
};

export const getMoviesByType = async (type: string, page: number = 1) => {
  const endpoints: Record<string, string> = {
    popular: "/movie/popular",
    top_rated: "/movie/top_rated",
    upcoming: "/movie/upcoming",
  };

  const endpoint = endpoints[type] || endpoints.popular;

  const res = await tmdbClient.get(endpoint, {
    ...requestAuth,
    params: { ...(requestAuth as any).params, page },
  });

  return res.data;
};

export const getMovieCredits = async (id: string) => {
  const res = await tmdbClient.get(`/movie/${id}/credits`, requestAuth);
  return res.data;
};

export const getSimilarMovies = async (id: string | number) => {
  const res = await tmdbClient.get(`/movie/${id}/similar`, requestAuth);
  return res.data;
};