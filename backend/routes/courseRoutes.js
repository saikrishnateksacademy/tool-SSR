import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

// Routes
router.post("/", createCourse);        // Create new course
router.get("/", getAllCourses);        // Get all courses
router.get("/:idOrName", getCourse);   // Get course by ID or Name
router.put("/:id", updateCourse);      // Update course by ID
router.delete("/:id", deleteCourse);   // Delete course by ID

export default router;
