import express from "express";
import {
  createCourse,
  getAllCourses,
  getCourse,
  updateCourse,
  deleteCourse,
  bulkUpdateCourses,
  bulkDeleteCourses,
  bulkUpdateStatus,
} from "../controllers/courseController.js";

const router = express.Router();

// Regular CRUD Routes
router.post("/", createCourse);
router.get("/", getAllCourses);
router.get("/:idOrName", getCourse);
router.put("/:id", updateCourse);
router.delete("/:id", deleteCourse);

// ✨ Bulk Operation Routes
router.post("/bulk/update", bulkUpdateCourses);
router.post("/bulk/delete", bulkDeleteCourses);
router.post("/bulk/status", bulkUpdateStatus);

export default router;