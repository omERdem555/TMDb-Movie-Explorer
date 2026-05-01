import axios from "axios";
import type { Movie } from "../types/movie.types";

const API_BASE = "http://localhost:5000/api";

type ApiResponse<T> = {
  success: boolean;
  data: T;
};

// --------------------
// REQUEST WRAPPER
// --------------------
const request = async <T>(
  url: string,
  params?: any
): Promise<T> => {
  const res = await axios.get<ApiResponse<T>>(url, { params });
  return res.data.data;
};

// --------------------
// SINGLE SOURCE API
// --------------------
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

// DETAIL (KULLANIYORSAN KALSIN)
export const fetchMovieDetail = (id: string) => {
  return request<Movie>(`${API_BASE}/movies/${id}`);
};