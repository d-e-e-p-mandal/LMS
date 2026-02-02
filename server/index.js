// 🔴 MUST be the very first line
import "dotenv/config";

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import connectDB from "./database/db.js";

import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";

/* =========================
   __dirname FIX (ES MODULE)
========================= */
const _dirname = path.resolve();

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
   🔥 STRIPE WEBHOOK (MUST BE FIRST)
========================= */
app.use(
   "/api/v1/purchase/webhook",
   express.raw({ type: "application/json" })
 );

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
    origin: (origin, cb) => {    // origin : true // same site
      // ✅ Allow requests with NO origin
      // (server-side, health checks, static files)
      if (!origin) return cb(null, true);

      // ✅ Allow known origins
      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      // ✅ DO NOT throw error (prevents Render crash)
      return cb(null, true);
    },

    // ✅ Allow cookies / auth headers
    credentials: true,

    // ✅ Allowed HTTP methods
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

    // ✅ Allowed request headers
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
    ],

    // ✅ Headers exposed to frontend
    exposedHeaders: ["Set-Cookie"],

    // ✅ Cache preflight response
    maxAge: 86400, // 24 hours
  })
);

// ✅ REQUIRED for browser preflight (OPTIONS)
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
app.use(express.static(path.join(_dirname,"/client/dist"))); // frontend

app.get('*', (req, res)=>{
    res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

/* =========================
   SERVER
========================= */
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});