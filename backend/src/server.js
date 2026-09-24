import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();

const PORT = ENV.PORT || 3000;

// Enable trust proxy for deployment platforms (Render, Railway, Vercel, Heroku, etc.)
app.set("trust proxy", 1);

app.use(express.json({ limit: "5mb" })); // req.body

const clientUrl = ENV.CLIENT_URL ? ENV.CLIENT_URL.replace(/\/+$/, "") : "";

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps/curl), matching clientUrl, or any development origin
      if (!origin || !clientUrl || origin === clientUrl || origin.replace(/\/+$/, "") === clientUrl || origin.startsWith("http://localhost")) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);
app.use(cookieParser());

// Health check endpoints for keep-alive cron jobs (e.g., cron-job.org / UptimeRobot)
app.get("/health", (_, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.get("/api/health", (_, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// make ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});
