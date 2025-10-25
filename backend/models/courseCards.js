// models/CourseCard.js
import mongoose from "mongoose";

const CourseCardSchema = new mongoose.Schema(
  {
    type: { type: String, default: "course_card" },
    programInternalName: { type: String, required: true, unique: true },
    programTitle: { type: String, required: true },
    category: { type: String, required: true },
    subCategory: String,

    media: {
      thumbnailUrl: String,
      alt: String
    },

    pricing: {
      feeRange: String,
      currency: { type: String, default: "INR" },
      scholarships: Boolean,
      emiAvailable: Boolean,
      noCostEmi: Boolean
    },

    duration: {
      label: String,
      minMonths: Number,
      maxMonths: Number
    },

    delivery: {
      mode: String, // Online / Hybrid / Offline
      format: [String]
    },

    tags: [String],

    ctaButtons: [
      {
        label: String,
        url: String,
        opensForm: Boolean
      }
    ],

    universities: [
      {
        name: String,
        logoUrl: String,
        sourceId: Number,
        partnershipType: String
      }
    ],

    specializations: [
      {
        name: String,
        slug: String,
        productId: String,
        universityOffering: [
          {
            universityName: String,
            sourceId: Number
          }
        ]
      }
    ],

    meta: {
      slug: { type: String, required: true, unique: true },
      canonicalUrl: String,
      status: { type: String, enum: ["draft", "published"], default: "draft" },
      visibility: { type: String, enum: ["public", "private"], default: "public" },
      priority: { type: Number, default: 0.5 },
      publishDate: Date,
      lastModified: Date
    },

    seo: {
      metaTitle: String,
      metaDescription: String,
      ogImage: String,
      schemaType: String
    },

    metrics: {
      views: { type: Number, default: 0 },
      clicks: { type: Number, default: 0 },
      conversions: { type: Number, default: 0 }
    },

    // 🔒 Audit + System Tracking
    createdBy: {
      userId: { type: String },
      name: { type: String },
      email: { type: String }
    },
    updatedBy: {
      userId: { type: String },
      name: { type: String },
      email: { type: String }
    },
    deletedAt: { type: Date, default: null },

    _schemaVersion: { type: Number, default: 2 }
  },
  {
    timestamps: true, // ✅ Automatically adds createdAt and updatedAt
    versionKey: false // Removes the default "__v" field for cleaner output
  }
);

// 🔍 Recommended indexes
CourseCardSchema.index({ "meta.slug": 1 }, { unique: true });
CourseCardSchema.index({ category: 1, subCategory: 1 });
CourseCardSchema.index({ "seo.metaTitle": "text", "seo.metaDescription": "text" });

export default mongoose.model("CourseCard", CourseCardSchema);
