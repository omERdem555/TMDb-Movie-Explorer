import axios from "axios";
import type { Movie } from "../types/movie.types";

const API_BASE = "http://localhost:5000/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

// -----------------------------
// INTERNAL BASE REQUEST WRAPPER
// -----------------------------
const request = async <T>(url: string, params?: any): Promise<T> => {
  const res = await axios.get<ApiResponse<T>>(url, { params });
  return res.data.data;
};

// -----------------------------
// EXPORTED API FUNCTIONS
// -----------------------------

export const fetchMovies = (type: string, page = 1) => {
  return request<Movie[]>(`${API_BASE}/movies/discover`, { type, page });
};

export const searchMovies = (query: string, type: string, page = 1) => {
  return request<Movie[]>(`${API_BASE}/movies/search`, {
    query,
    type,
    page,
  });
};

export const fetchMovieDetail = (id: string) => {
  return request<any>(`${API_BASE}/movies/${id}`);
};