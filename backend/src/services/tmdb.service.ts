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
export const getPopularMovies = async () => {
  const response = await tmdbClient.get("/movie/popular");
  return response.data;
};