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
export const uploadMedia = (buffer, folder = "lms/general", mimetype) => {
  const resourceType = mimetype?.startsWith("video") ? "video" : "image";

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


// Alternative :
/*
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

 //================= CLOUDINARY CONFIG ================= 
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ================= UPLOAD IMAGE / VIDEO =================
//   folders:
//   - lms/profile
//   - lms/course/thumbnails
//   - lms/course/lectures

export const uploadMedia = async (filePath, folder = "lms/general") => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: "auto", // ✅ BEST PRACTICE
    });

    // ✅ DELETE TEMP FILE AFTER UPLOAD 
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result;
  } catch (error) {
    // SAFETY CLEANUP 
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    console.error("CLOUDINARY UPLOAD ERROR:", error);
    throw error;
  }
};

// ================= DELETE IMAGE ================= 
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

// ================= DELETE VIDEO ================= 
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
*/