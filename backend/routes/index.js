// backend/routes/index.js
import express from "express";
import courseRoutes from "./courseRoutes.js";
import pageRoutes from "./pageRoutes.js";
import authRoutes from "./authRoutes.js";
import uploadRoutes from "./uploadRoutes.js";
import statsRoutes from "./statsRoutes.js";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/pages", pageRoutes);
router.use("/upload", uploadRoutes);
router.use("/stats", statsRoutes);
export default router;