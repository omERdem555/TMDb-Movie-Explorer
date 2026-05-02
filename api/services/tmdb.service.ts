import axios from "axios";

const API_KEY = process.env.TMDB_API_KEY!;

const tmdbClient = axios.create({
  baseURL: "https://api.themoviedb.org/3",
  params: {
    api_key: API_KEY,
  },
});

export const getPopularMovies = async (page = 1) => {
  const res = await tmdbClient.get("/movie/popular", {
    params: { page },
  });
  return res.data;
};

export const getTopRatedMovies = async (page = 1) => {
  const res = await tmdbClient.get("/movie/top_rated", {
    params: { page },
  });
  return res.data;
};

export const getUpcomingMovies = async (page = 1) => {
  const res = await tmdbClient.get("/movie/upcoming", {
    params: { page },
  });
  return res.data;
};