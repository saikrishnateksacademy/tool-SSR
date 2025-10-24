// src/models/CourseCard.js
import mongoose from "mongoose";

const CourseCardSchema = new mongoose.Schema(
  {
    courseId: { type: String, unique: true },
    title: { type: String, required: true },
    subtitle: String,
    shortDescription: String,
    thumbnail: {
      url: String,
      alt: String,
    },
    price: {
      currency: String,
      amount: Number,
    },
    durationWeeks: Number,
    level: String,
    categoryIds: [String],
    slug: { type: String, unique: true },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("CourseCard", CourseCardSchema);
