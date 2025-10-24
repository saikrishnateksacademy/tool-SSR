// src/models/Page.js
import mongoose from "mongoose";

const PageSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g. "course_landing", "about"
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    contentBlocks: { type: Array, default: [] }, // flexible sections
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
      canonical: String,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    publishDate: Date,
    lastModified: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Page", PageSchema);
