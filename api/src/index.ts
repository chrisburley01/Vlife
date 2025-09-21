import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";

import { users } from "./routes/users.js";
import { videos } from "./routes/videos.js";
import { social } from "./routes/social.js";

const app = express();

// Security & middleware
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
  })
);

// Health check
app.get("/health", (_, res) => res.json({ ok: true }));

// Routes
app.use("/api/users", users);
app.use("/api/videos", videos);
app.use("/api/social", social);

// Start server
const port = Number(process.env.PORT || 4000);
app.listen(port, () => {
  console.log(`✅ vlife API running on http://localhost:${port}`);
});