import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import upload from "../utils/multer.js";
import {
  createCourse,
  searchCourse,
  getPublishedCourse,
  getCreatorCourses,
  editCourse,
  getCourseById,
  createLecture,
  getCourseLecture,
  editLecture,
  removeLecture,
  getLectureById,
  togglePublishCourse,
} from "../controllers/course.controller.js";

const router = express.Router();

router.route("/")
  .get(isAuthenticated, getCreatorCourses)
  .post(isAuthenticated, createCourse);

router.get("/search", isAuthenticated, searchCourse);
router.get("/published-courses", getPublishedCourse);

router
  .route("/:courseId")
  .get(isAuthenticated, getCourseById)
  .put(isAuthenticated, upload.single("thumbnail"), editCourse) // ✅ FIX
  .patch(isAuthenticated, togglePublishCourse);

router
  .route("/:courseId/lecture")
  .post(isAuthenticated, createLecture)
  .get(isAuthenticated, getCourseLecture);

router
  .route("/:courseId/lecture/:lectureId")
  .put(isAuthenticated, upload.single("file"), editLecture);

router
  .route("/lecture/:lectureId")
  .get(isAuthenticated, getLectureById)
  .delete(isAuthenticated, removeLecture);

export default router;