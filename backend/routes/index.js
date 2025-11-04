import express from "express";
import courseRoutes from "./courseRoutes.js";
import pageRoutes from "./pageRoutes.js";
import authRoutes from "./authRoutes.js";


const router = express.Router();

router.use("/auth", authRoutes);
router.use("/courses", courseRoutes);
router.use("/pages", pageRoutes);


export default router;