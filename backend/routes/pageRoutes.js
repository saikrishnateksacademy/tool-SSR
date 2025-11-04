import express from "express";
import {
  createPage,
  getAllPages,
  getPageBySlug,
  updatePage,
  deletePage
} from "../controllers/pageController.js";

const router = express.Router();

router.post("/", createPage);
router.get("/", getAllPages);
router.get("/:slug", getPageBySlug);
router.put("/:id", updatePage);
router.delete("/:id", deletePage);

export default router;