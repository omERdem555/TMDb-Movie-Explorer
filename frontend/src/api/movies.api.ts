import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const fetchMovies = async (type: string, page: number = 1) => {
  const res = await axios.get(`${API_BASE}/movies/discover`, {
    params: { type, page },
  });

  return res.data;
};

export const fetchMovieDetail = async (id: string) => {
  const res = await axios.get(`${API_BASE}/movies/${id}`);
  return res.data;
};

export const searchMovies = async (query: string, page: number = 1) => {
  const res = await axios.get(`${API_BASE}/movies/search`, {
    params: { query, page },
  });

  return res.data;
};