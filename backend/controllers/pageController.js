import Page from "../models/page.js";

export const createPage = async (req, res) => {
  try {
    const page = await Page.create(req.body);
    res.status(201).json(page);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllPages = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const pages = await Page.find(filter).sort({ createdAt: -1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getPageBySlug = async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: "Page not found" });
    res.json(page);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updatePage = async (req, res) => {
  try {
    const updated = await Page.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Page not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletePage = async (req, res) => {
  try {
    const deleted = await Page.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Page not found" });
    res.json({ message: "Page deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//search 
export const searchPages = async (req, res) => {
  try {
    const { q, status } = req.query;
    let query = {};
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { slug: { $regex: q, $options: "i" } },
        { "seo.metaTitle": { $regex: q, $options: "i" } },
      ];
    }
    if (status) query.status = status;

    const pages = await Page.find(query).sort({ createdAt: -1 });
    res.json(pages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Bulk update status
export const bulkUpdatePageStatus = async (req, res) => {
  try {
    const { ids, status } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Provide array of page IDs" });
    }
    if (!["draft", "published"].includes(status)) {
      return res.status(400).json({ error: "Status must be 'draft' or 'published'" });
    }

    const result = await Page.updateMany(
      { _id: { $in: ids } },
      { $set: { status, lastModified: Date.now() } }
    );

    res.json({
      success: true,
      modified: result.modifiedCount,
      message: `${result.modifiedCount} page(s) ${status === "published" ? "published" : "unpublished"}`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Bulk delete
export const bulkDeletePages = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Provide array of page IDs" });
    }

    const result = await Page.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      deleted: result.deletedCount,
      message: `${result.deletedCount} page(s) deleted successfully`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};