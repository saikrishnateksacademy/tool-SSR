import CourseCard from "../models/courseCards.js";
import Page from "../models/page.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalCourses = await CourseCard.countDocuments();
    const publishedCourses = await CourseCard.countDocuments({
      "meta.status": "published",
    });
    const draftCourses = await CourseCard.countDocuments({
      "meta.status": "draft",
    });
    
    const totalPages = await Page.countDocuments();
    const publishedPages = await Page.countDocuments({ status: "published" });
    
    const coursesByCategory = await CourseCard.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    
    const recentCourses = await CourseCard.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("programTitle category createdAt meta.status");
    
    res.json({
      courses: {
        total: totalCourses,
        published: publishedCourses,
        draft: draftCourses,
      },
      pages: {
        total: totalPages,
        published: publishedPages,
      },
      coursesByCategory,
      recentCourses,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};