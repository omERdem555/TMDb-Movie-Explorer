import express from "express";
import cors from "cors";
import { env } from "./config/env";

const app = express();
const PORT = env.PORT;

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("TMDb Movie Explorer API is running...");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});