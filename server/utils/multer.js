import multer from "multer";

/* ================= STORAGE (MEMORY) ================= */
const storage = multer.memoryStorage();

/* ================= FILE FILTER ================= */
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/jpg",
    "video/mp4",
    "video/webm",
    "video/x-matroska", // ✅ FIX
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Only images (jpg, png) and videos (mp4, mkv, webm) are allowed"
      ),
      false
    );
  }
};

/* ================= MULTER CONFIG ================= */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 100, // 100MB
  },
});

export default upload;