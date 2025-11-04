import CourseCard from "../models/courseCards.js";

/** 🟢 Create a new course */
export const createCourse = async (req, res) => {
  try {
    const course = await CourseCard.create(req.body);
    res.status(201).json(course);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/** 🟢 Get all courses */
export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseCard.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** 🟢 Get a single course by ID or Name */
export const getCourse = async (req, res) => {
  try {
    const { idOrName } = req.params;

    // Check if the parameter is a valid MongoDB ObjectId
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(idOrName);

    const course = isObjectId
      ? await CourseCard.findById(idOrName)
      : await CourseCard.findOne({ programTitle: idOrName });

    if (!course)
      return res.status(404).json({ message: "Course not found" });

    res.json(course);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** 🟢 Update a course by ID */
export const updateCourse = async (req, res) => {
  try {
    const updated = await CourseCard.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated)
      return res.status(404).json({ message: "Course not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

/** 🟢 Delete a course by ID */
export const deleteCourse = async (req, res) => {
  try {
    const deleted = await CourseCard.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Course not found" });
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const searchCourses = async (req, res) => {
  try {
    const { q, category, status, tags } = req.query;
    
    let query = {};
    
    if (q) {
      query.$or = [
        { programTitle: { $regex: q, $options: "i" } },
        { programInternalName: { $regex: q, $options: "i" } },
        { "seo.metaTitle": { $regex: q, $options: "i" } },
      ];
    }
    
    if (category) query.category = category;
    if (status) query["meta.status"] = status;
    if (tags) query.tags = { $in: Array.isArray(tags) ? tags : [tags] };
    
    const courses = await CourseCard.find(query).sort({ createdAt: -1 });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/** 🟢 Bulk Update Courses */
export const bulkUpdateCourses = async (req, res) => {
  try {
    const { ids, updates } = req.body;
    
    // Validate input
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Please provide an array of course IDs" });
    }
    
    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ error: "Please provide updates object" });
    }
    
    // Add lastModified timestamp
    const updateData = {
      ...updates,
      "meta.lastModified": Date.now(),
    };
    
    const result = await CourseCard.updateMany(
      { _id: { $in: ids } },
      { $set: updateData }
    );
    
    res.json({
      success: true,
      modified: result.modifiedCount,
      matched: result.matchedCount,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** 🟢 Bulk Delete Courses */
export const bulkDeleteCourses = async (req, res) => {
  try {
    const { ids } = req.body;
    
    // Validate input
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Please provide an array of course IDs" });
    }
    
    const result = await CourseCard.deleteMany({ _id: { $in: ids } });
    
    res.json({
      success: true,
      deleted: result.deletedCount,
      message: `${result.deletedCount} course(s) deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/** 🟢 Bulk Publish/Unpublish Courses */
export const bulkUpdateStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    
    // Validate input
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Please provide an array of course IDs" });
    }
    
    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({ error: "Status must be 'draft' or 'published'" });
    }
    
    const result = await CourseCard.updateMany(
      { _id: { $in: ids } },
      { 
        $set: { 
          "meta.status": status,
          "meta.lastModified": Date.now(),
          ...(status === "published" && { "meta.publishDate": Date.now() }),
        },
      }
    );
    
    res.json({
      success: true,
      modified: result.modifiedCount,
      message: `${result.modifiedCount} course(s) ${status === "published" ? "published" : "unpublished"}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};