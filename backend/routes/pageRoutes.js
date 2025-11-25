// backend/routes/pageRoutes.js
import express from "express";
import {
  createPage, getAllPages, getPageBySlug, updatePage, deletePage,
  searchPages, bulkUpdatePageStatus, bulkDeletePages  
} from "../controllers/pageController.js";
import { authenticate, authorize } from "../middleware/auth.js"; 

const router = express.Router();
router.post("/", authenticate, authorize("admin", "editor"), createPage);
router.get("/", getAllPages);  
router.get("/:slug", getPageBySlug);
router.put("/:id", authenticate, authorize("admin", "editor"), updatePage);
router.delete("/:id", authenticate, authorize("admin"), deletePage);
router.get("/search", searchPages); 
router.post("/bulk/status", authenticate, authorize("admin"), bulkUpdatePageStatus);  
router.post("/bulk/delete", authenticate, authorize("admin"), bulkDeletePages); 

export default router;