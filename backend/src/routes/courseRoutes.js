// src/routes/courseRoutes.js
import express from "express";
import CourseCard from "../models/courseCards.js";
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const card = await CourseCard.create(req.body);
    res.status(201).json(card);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  const cards = await CourseCard.find({ status: "published" }).sort({ createdAt: -1 });
  res.json(cards);
});

router.get("/:slug", async (req, res) => {
  const card = await CourseCard.findOne({ slug: req.params.slug });
  res.json(card);
});

export default router;
