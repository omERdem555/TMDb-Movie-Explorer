import axios from "axios";
import type { Movie,} from "../types/movie.types";

// Use environment variable or default to /api for Vercel
const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

const request = async <T>(url: string, params?: any): Promise<T> => {
  const res = await axios.get<ApiResponse<T>>(url, { params });

  if (!res.data?.success) {
    throw new Error("API Error");
  }

  return res.data.data;
};

// DISCOVER
export const fetchMovies = (
  type: string,
  page = 1,
  genres?: string,
  search?: string
) => {
  return request<Movie[]>(`${API_BASE}/movies`, {
    type,
    page,
    genres,
    search,
  });
};

// SEARCH
export const searchMovies = (
  query: string,
  page = 1,
  type: string
) => {
  return request<Movie[]>(`${API_BASE}/movies/search`, {
    query,
    page,
    type,
  });
};

// DETAIL
export const fetchMovieDetail = async (id: string) => {
  const res = await axios.get(`${API_BASE}/movies/${id}`);

  if (res.data?.data) {
    return res.data.data;
  }

  return res.data;
};