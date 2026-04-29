import axios from "axios";
import { env } from "../config/env";

const BASE_URL = "https://api.themoviedb.org/3";

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: env.TMDB_API_KEY,
  },
});

// 1. Popular movies
export const getPopularMovies = async (page: number = 1) => {
  const response = await tmdbClient.get("/movie/popular", {
    params: {
      page,
    },
  });

  return response.data;
};

export const getTopRatedMovies = async (page: number = 1) => {
  const res = await tmdbClient.get("/movie/top_rated", {
    params: { page },
  });

  return res.data;
};

export const getUpcomingMovies = async (page: number = 1) => {
  const res = await tmdbClient.get("/movie/upcoming", {
    params: { page },
  });

  return res.data;
};

export const getMovieById = async (id: string) => {
  const res = await tmdbClient.get(`/movie/${id}`);
  return res.data;
};

export const searchMovies = async (query: string, page: number = 1) => {
  const res = await tmdbClient.get("/search/movie", {
    params: { query, page },
  });

  return res.data;
};