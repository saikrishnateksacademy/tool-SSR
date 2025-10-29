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
