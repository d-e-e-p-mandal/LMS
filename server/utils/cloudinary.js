import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

/* ================= CLOUDINARY CONFIG ================= */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* ================= UPLOAD IMAGE / VIDEO =================
   folder examples:
   - lms/profile
   - lms/course/thumbnails
   - lms/course/lectures
*/
export const uploadMedia = (buffer, folder = "lms/general", mimetype = "") => {
  if (!buffer) {
    return Promise.reject(new Error("No file buffer provided"));
  }

  const resourceType = mimetype.startsWith("video") ? "video" : "image";

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) {
            console.error("CLOUDINARY UPLOAD ERROR:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      )
      .end(buffer);
  });
};

/* ================= DELETE IMAGE ================= */
export const deleteMediaFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "image",
    });
  } catch (error) {
    console.error("CLOUDINARY DELETE IMAGE ERROR:", error);
    throw error;
  }
};

/* ================= DELETE VIDEO ================= */
export const deleteVideoFromCloudinary = async (publicId) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "video",
    });
  } catch (error) {
    console.error("CLOUDINARY DELETE VIDEO ERROR:", error);
    throw error;
  }
};