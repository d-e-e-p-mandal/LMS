// file: middlewares/isAuthenticated.js

import jwt from "jsonwebtoken";

const isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // ✅ FIX 1: use SAME env key everywhere
    // must match generateToken()
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX 2: payload key is `id`, not `userId`
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // ✅ FIX 3: attach user id correctly
    req.id = decoded.id;

    next();
  } catch (error) {
    console.error("AUTH ERROR:", error.message);
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default isAuthenticated;