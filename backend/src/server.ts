import express from "express";
import cors from "cors";
import movieRoutes from "./routes/movies.routes";

const app = express();
const PORT = 5000;

/**
 * Core middleware
 */
app.use(cors());
app.use(express.json());

/**
 * Routes
 */
app.use("/api/movies", movieRoutes);

/**
 * Health check
 */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "TMDb Movie Explorer API is running...",
  });
});

/**
 * Start server
 */
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});