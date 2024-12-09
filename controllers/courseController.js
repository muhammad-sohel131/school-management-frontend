const Course = require("../models/Course");
const User = require("../models/User");

exports.createCourse = async (req, res) => {
  try {
    const { title, description, teacherId } = req.body;

    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== "Teacher") {
      return res.status(400).json({ message: "Invalid teacher ID" });
    }

    const course = new Course({ title, description, teacher: teacherId });
    await course.save();

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Courses
exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("teacher", "name email");
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a Course by ID
exports.getCourseById = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id).populate("teacher", "name email").populate("students", "name email");
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Enroll a Student
exports.enrollStudent = async (req, res) => {
  try {
    const { courseId, studentId } = req.body;

    const student = await User.findById(studentId);
    if (!student || student.role !== "Student") {
      return res.status(400).json({ message: "Invalid student ID" });
    }

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (course.students.includes(studentId)) {
      return res.status(400).json({ message: "Student already enrolled" });
    }

    course.students.push(studentId);
    await course.save();

    res.status(200).json({ message: "Student enrolled successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
