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
export const uploadMedia = (buffer, folder, mimetype) => {
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

/* ================= DELETE MEDIA ================= */
export const deleteMediaFromCloudinary = async (
  publicId,
  resourceType = "image"
) => {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });
  } catch (error) {
    console.error("CLOUDINARY DELETE ERROR:", error);
    throw error;
  }
};