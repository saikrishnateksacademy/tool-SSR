import express from "express";
import courseRoutes from "./courseRoutes.js";
import pageRoutes from "./pageRoutes.js";

const router = express.Router();

router.use("/courses", courseRoutes);
router.use("/pages", pageRoutes);

export default router;
