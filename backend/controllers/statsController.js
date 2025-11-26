import CourseCard from "../models/courseCards.js";
import Page from "../models/page.js";

export const getDashboardStats = async (req, res) => {
  try {
    // 🚀 Run all queries in parallel for better performance
    const [courseStats, pageStats, coursesByCategory, recentCourses, recentPages] = await Promise.all([
      // Single aggregation for all course counts using $facet
      CourseCard.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            published: [{ $match: { "meta.status": "published" } }, { $count: "count" }],
            draft: [{ $match: { "meta.status": "draft" } }, { $count: "count" }]
          }
        }
      ]),

      // Single aggregation for all page counts using $facet
      Page.aggregate([
        {
          $facet: {
            total: [{ $count: "count" }],
            published: [{ $match: { status: "published" } }, { $count: "count" }]
          }
        }
      ]),

      // Category aggregation
      CourseCard.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
      ]),

      // Recent courses with .lean() for faster serialization
      CourseCard.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("programTitle category createdAt meta.status")
        .lean(),

      // Recent pages with .lean() for faster serialization
      Page.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title type createdAt status")
        .lean()
    ]);

    // Extract counts from aggregation results
    const courseCounts = courseStats[0];
    const pageCounts = pageStats[0];

    res.json({
      courses: {
        total: courseCounts.total[0]?.count || 0,
        published: courseCounts.published[0]?.count || 0,
        draft: courseCounts.draft[0]?.count || 0,
      },
      pages: {
        total: pageCounts.total[0]?.count || 0,
        published: pageCounts.published[0]?.count || 0,
      },
      coursesByCategory,
      recentCourses,
      recentPages,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};