// src/routes/pageRoutes.js
import express from "express";
import Page from "../models/page.js";
const router = express.Router();

// CREATE
router.post("/", async (req, res) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json(page);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ ALL (published)
router.get("/", async (req, res) => {
  const pages = await Page.find({ status: "published" }).sort({ publishDate: -1 });
  res.json(pages);
});

// READ BY SLUG
router.get("/:slug", async (req, res) => {
  const page = await Page.findOne({ slug: req.params.slug });
  if (!page) return res.status(404).json({ message: "Not found" });
  res.json(page);
});

// UPDATE
router.put("/:id", async (req, res) => {
  const page = await Page.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(page);
});

// DELETE
router.delete("/:id", async (req, res) => {
  await Page.findByIdAndDelete(req.params.id);
  res.json({ message: "Page deleted" });
});

export default router;
