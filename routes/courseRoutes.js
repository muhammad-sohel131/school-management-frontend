const express = require("express");
const {
  createCourse,
  getCourses,
  getCourseById,
  enrollStudent,
} = require("../controllers/courseController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

// Admin: Create a Course
router.post("/", protect(["Admin"]), createCourse);

// Get All Courses
router.get("/", protect(["Admin", "Teacher", "Student"]), getCourses);

// Get a Course by ID
router.get("/:id", protect(["Admin", "Teacher", "Student"]), getCourseById);

// Enroll a Student
router.post("/enroll", protect(["Admin", "Teacher"]), enrollStudent);

module.exports = router;
