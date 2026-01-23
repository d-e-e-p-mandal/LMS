import jwt from "jsonwebtoken";

export const generateToken = (res, user, message) => {
  try {
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .json({
        success: true,
        message,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

  } catch (err) {
    console.error("TOKEN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Token generation failed",
    });
  }
};