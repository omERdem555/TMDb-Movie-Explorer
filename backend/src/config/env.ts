import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["TMDB_API_KEY"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export const env = {
  PORT: process.env.PORT || "5000",
  TMDB_API_KEY: process.env.TMDB_API_KEY as string,
};