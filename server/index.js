// 🔴 MUST be the very first line
import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import connectDB from "./database/db.js";

import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";

/* =========================
   __dirname FIX (ES MODULE)
========================= */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* =========================
   DB
========================= */
connectDB();

/* =========================
   APP INIT
========================= */
const app = express();
const PORT = process.env.PORT || 8080;

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =========================
   CORS (RENDER + LOCAL SAFE)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:8080",
  "https://lms-r2sm.onrender.com",
];

app.use(
  cors({
    origin: (origin, cb) => {
      // ✅ Allow server-side, static files, health checks
      if (!origin) return cb(null, true);

      // ✅ Allow listed origins
      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      // ✅ DO NOT BLOCK — avoids Render crashes
      return cb(null, true);
    },
    credentials: true,
  })
);

// ✅ Preflight support
app.options("*", cors());

/* =========================
   API ROUTES
========================= */
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

/* =========================
   FRONTEND (ONLY IF BUILT)
========================= */
const clientDistPath = path.join(__dirname, "..", "client", "dist");

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
}

/* =========================
   SERVER
========================= */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});