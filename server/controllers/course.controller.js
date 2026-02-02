// file: controllers/course.controller.js

import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import {
  uploadMedia,
  deleteMediaFromCloudinary,
  deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";

/* ================= CREATE COURSE ================= */
export const createCourse = async (req, res) => {
  try {
    const { courseTitle, category } = req.body;

    if (!courseTitle?.trim() || !category?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Course title and category are required",
      });
    }

    const course = await Course.create({
      courseTitle: courseTitle.trim(),
      category: category.trim(),
      creator: req.id,
    });

    return res.status(201).json({
      success: true,
      course,
      message: "Course created successfully",
    });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create course",
    });
  }
};

/* ================= SEARCH COURSE ================= */
export const searchCourse = async (req, res) => {
  try {
    const { query = "", categories = [], sortByPrice = "" } = req.query;

    const searchCriteria = {
      isPublished: true,
      $or: [
        { courseTitle: { $regex: query, $options: "i" } },
        { subTitle: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    };

    if (categories.length > 0) {
      searchCriteria.category = { $in: categories };
    }

    const sortOptions = {};
    if (sortByPrice === "low") sortOptions.coursePrice = 1;
    if (sortByPrice === "high") sortOptions.coursePrice = -1;

    const courses = await Course.find(searchCriteria)
      .populate({ path: "creator", select: "name photoUrl" })
      .sort(sortOptions);

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("SEARCH COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Search failed",
    });
  }
};

/* ================= GET PUBLISHED COURSES ================= */
export const getPublishedCourse = async (_, res) => {
  try {
    const courses = await Course.find({ isPublished: true }).populate({
      path: "creator",
      select: "name photoUrl",
    });

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("GET PUBLISHED COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get published courses",
    });
  }
};

/* ================= GET CREATOR COURSES ================= */
export const getCreatorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ creator: req.id });

    return res.status(200).json({
      success: true,
      courses,
    });
  } catch (error) {
    console.error("GET CREATOR COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get creator courses",
    });
  }
};

/* ================= EDIT COURSE ================= */
export const editCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      coursePrice,
    } = req.body;

    const thumbnail = req.file;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    let courseThumbnail = course.courseThumbnail;

    if (thumbnail) {
      if (course.courseThumbnail) {
        const publicId =
          "lms/course/thumbnails/" +
          course.courseThumbnail.split("/").pop().split(".")[0];

        await deleteMediaFromCloudinary(publicId);
      }

      const uploaded = await uploadMedia(
        thumbnail.buffer,
        "lms/course/thumbnails",
        thumbnail.mimetype
      );
      courseThumbnail = uploaded.secure_url;
    }

    const updatePayload = {
      courseTitle,
      subTitle,
      description,
      category,
      courseLevel,
      courseThumbnail,
    };

    if (coursePrice !== undefined && coursePrice !== "") {
      updatePayload.coursePrice = Number(coursePrice);
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      updatePayload,
      { new: true }
    );

    return res.status(200).json({
      success: true,
      course: updatedCourse,
      message: "Course updated successfully",
    });
  } catch (error) {
    console.error("EDIT COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update course",
    });
  }
};

/* ================= GET COURSE BY ID ================= */
export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId)
      .populate("lectures")
      .populate({ path: "creator", select: "name photoUrl" });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      course,
    });
  } catch (error) {
    console.error("GET COURSE BY ID ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course",
    });
  }
};

/* ================= CREATE LECTURE ================= */
export const createLecture = async (req, res) => {
  try {
    const { lectureTitle } = req.body;
    const { courseId } = req.params;

    if (!lectureTitle?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Lecture title is required",
      });
    }

    const lecture = await Lecture.create({
      lectureTitle: lectureTitle.trim(),
    });

    await Course.findByIdAndUpdate(courseId, {
      $push: { lectures: lecture._id },
    });

    return res.status(201).json({
      success: true,
      lecture,
      message: "Lecture created successfully",
    });
  } catch (error) {
    console.error("CREATE LECTURE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create lecture",
    });
  }
};

/* ================= GET COURSE LECTURES ================= */
export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    return res.status(200).json({
      success: true,
      lectures: course.lectures,
    });
  } catch (error) {
    console.error("GET COURSE LECTURE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lectures",
    });
  }
};

/* ================= EDIT LECTURE ================= */
export const editLecture = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const { lectureTitle, isPreviewFree } = req.body;
    const videoFile = req.file;

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    if (lectureTitle) lecture.lectureTitle = lectureTitle;

    if (videoFile) {
      if (lecture.publicId) {
        await deleteVideoFromCloudinary(lecture.publicId);
      }

      const uploaded = await uploadMedia(
        videoFile.buffer,
        "lms/course/lectures",
        videoFile.mimetype
      );

      lecture.videoUrl = uploaded.secure_url;
      lecture.publicId = uploaded.public_id;
    }

    /* ✅ CRITICAL FIX */
    if (isPreviewFree !== undefined) {
      lecture.isPreviewFree =
        isPreviewFree === "true" || isPreviewFree === true;
    }

    await lecture.save();

    return res.status(200).json({
      success: true,
      lecture,
      message: "Lecture updated successfully",
    });
  } catch (error) {
    console.error("EDIT LECTURE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to edit lecture",
    });
  }
};

/* ================= GET LECTURE BY ID ================= */
export const getLectureById = async (req, res) => {
  try {
    const lecture = await Lecture.findById(req.params.lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    return res.status(200).json({
      success: true,
      lecture,
    });
  } catch (error) {
    console.error("GET LECTURE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get lecture",
    });
  }
};

/* ================= REMOVE LECTURE ================= */
export const removeLecture = async (req, res) => {
  try {
    const lecture = await Lecture.findByIdAndDelete(req.params.lectureId);
    if (!lecture) {
      return res.status(404).json({
        success: false,
        message: "Lecture not found",
      });
    }

    if (lecture.publicId) {
      await deleteVideoFromCloudinary(lecture.publicId);
    }

    await Course.updateOne(
      { lectures: lecture._id },
      { $pull: { lectures: lecture._id } }
    );

    return res.status(200).json({
      success: true,
      message: "Lecture removed successfully",
    });
  } catch (error) {
    console.error("REMOVE LECTURE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to remove lecture",
    });
  }
};

/* ================= TOGGLE PUBLISH COURSE ================= */
export const togglePublishCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { publish } = req.query;

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    if (publish === "true" && course.lectures.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Add at least one lecture before publishing",
      });
    }

    if (publish === "true") {
      const hasPublicPreview = course.lectures.some(
        (lecture) => lecture.videoUrl && lecture.isPreviewFree === true
      );

      if (!hasPublicPreview) {
        return res.status(400).json({
          success: false,
          message:
            "Add at least one public (preview) lecture video to publish",
        });
      }
    }

    await Course.findByIdAndUpdate(
      courseId,
      { isPublished: publish === "true" },
      { runValidators: false }
    );

    return res.status(200).json({
      success: true,
      message:
        publish === "true"
          ? "Course published successfully"
          : "Course unpublished",
    });
  } catch (error) {
    console.error("PUBLISH COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update publish status",
    });
  }
};