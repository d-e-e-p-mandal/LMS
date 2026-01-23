import { CourseProgress } from "../models/courseProgress.js";
import { Course } from "../models/course.model.js";

/* ================= GET COURSE PROGRESS ================= */
export const getCourseProgress = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // 1️⃣ Get course details
    const courseDetails = await Course.findById(courseId).populate("lectures");
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 2️⃣ Get user progress
    const courseProgress = await CourseProgress.findOne({
      courseId,
      userId,
    });

    // 3️⃣ If no progress yet
    if (!courseProgress) {
      return res.status(200).json({
        success: true,
        data: {
          courseDetails,
          progress: [],
          completed: false,
        },
      });
    }

    // 4️⃣ Return progress
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        progress: courseProgress.lectureProgress,
        completed: courseProgress.completed,
      },
    });
  } catch (error) {
    console.error("GET COURSE PROGRESS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to get course progress",
    });
  }
};

/* ================= UPDATE LECTURE PROGRESS ================= */
export const updateLectureProgress = async (req, res) => {
  try {
    const { courseId, lectureId } = req.params;
    const userId = req.id;

    // 1️⃣ Get or create progress
    let courseProgress = await CourseProgress.findOne({ courseId, userId });

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        userId,
        courseId,
        completed: false,
        lectureProgress: [],
      });
    }

    // 2️⃣ Update lecture progress
    const lectureIndex = courseProgress.lectureProgress.findIndex(
      (l) => l.lectureId.toString() === lectureId
    );

    if (lectureIndex !== -1) {
      courseProgress.lectureProgress[lectureIndex].viewed = true;
    } else {
      courseProgress.lectureProgress.push({
        lectureId,
        viewed: true,
      });
    }

    // 3️⃣ Check completion
    const course = await Course.findById(courseId);
    const viewedCount = courseProgress.lectureProgress.filter(
      (l) => l.viewed
    ).length;

    if (course && course.lectures.length === viewedCount) {
      courseProgress.completed = true;
    }

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Lecture progress updated successfully",
    });
  } catch (error) {
    console.error("UPDATE LECTURE PROGRESS ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update lecture progress",
    });
  }
};

/* ================= MARK COURSE AS COMPLETED ================= */
export const markAsCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    courseProgress.lectureProgress.forEach(
      (lecture) => (lecture.viewed = true)
    );
    courseProgress.completed = true;

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course marked as completed",
    });
  } catch (error) {
    console.error("MARK COMPLETED ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark course as completed",
    });
  }
};

/* ================= MARK COURSE AS INCOMPLETE ================= */
export const markAsInCompleted = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const courseProgress = await CourseProgress.findOne({ courseId, userId });
    if (!courseProgress) {
      return res.status(404).json({
        success: false,
        message: "Course progress not found",
      });
    }

    courseProgress.lectureProgress.forEach(
      (lecture) => (lecture.viewed = false)
    );
    courseProgress.completed = false;

    await courseProgress.save();

    return res.status(200).json({
      success: true,
      message: "Course marked as incomplete",
    });
  } catch (error) {
    console.error("MARK INCOMPLETE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to mark course as incomplete",
    });
  }
};