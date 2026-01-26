import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./database/db.js";

import userRoute from "./routes/user.route.js";
import courseRoute from "./routes/course.route.js";
import mediaRoute from "./routes/media.route.js";
import purchaseRoute from "./routes/purchaseCourse.route.js";
import courseProgressRoute from "./routes/courseProgress.route.js";
import path from "path";

dotenv.config({ path: "./.env" }); // root .env

const _dirname = path.resolve();

//dotenv.config();

// ✅ DB connection
connectDB();

const app = express();
const PORT = process.env.PORT;

// ✅ BODY PARSERS (REQUIRED)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(_dirname,"/client/dist"))); // frontend

// ✅ CORS (correct for cookies)
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );
const allowedOrigins = [
  //"http://localhost:5173",
  //"http://localhost:8080",
  //process.env.CLIENT_URL,
  "https://lms-r2sm.onrender.com",
];


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://lms-r2sm.onrender.com",
    ],
    credentials: true,
  })
);
// REQUIRED for preflight
app.options("*", cors());

// ✅ ROUTES (ALL CORRECTLY MOUNTED)
app.use("/api/v1/user", userRoute);
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/media", mediaRoute);
app.use("/api/v1/purchase", purchaseRoute);
app.use("/api/v1/progress", courseProgressRoute);

app.get('*', (req, res)=>{
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

// ✅ SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});