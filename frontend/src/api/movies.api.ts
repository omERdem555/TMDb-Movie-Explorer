import axios from "axios";
import type { Movie } from "../types/movie.types";

const API_BASE = "http://localhost:5000/api";

type ApiResponse = {
  success: boolean;
  data: Movie[];
};

export const fetchMovies = async (
  type: string,
  page: number = 1
): Promise<ApiResponse> => {
  const res = await axios.get(`${API_BASE}/movies/discover`, {
    params: { type, page },
  });

  return res.data;
};

export const searchMovies = async (
  query: string,
  type: string,
  page: number = 1
): Promise<ApiResponse> => {
  const res = await axios.get(`${API_BASE}/movies/search`, {
    params: { query, type, page },
  });

  return res.data;
};

export const fetchMovieDetail = async (id: string) => {
  const res = await axios.get(`${API_BASE}/movies/${id}`);
  return res.data;
};