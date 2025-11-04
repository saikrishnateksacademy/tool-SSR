import express from "express";
import { upload } from "../middleware/upload.js";
import { uploadFile } from "../controllers/uploadController.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

router.post("/", authenticate, upload.single("file"), uploadFile);

export default router;