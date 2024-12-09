const Material = require("../models/Material");
const Course = require("../models/Course");

// Add Material to a Course
exports.addMaterial = async (req, res) => {
  try {
    const { title, description, fileUrl, courseId } = req.body;
    const { userId } = req.user; // Extract teacher ID from the token payload

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (String(course.teacher) !== userId) {
      return res.status(403).json({ message: "You are not authorized to add materials to this course" });
    }

    const material = new Material({
      title,
      description,
      fileUrl,
      course: courseId,
      createdBy: userId,
    });

    await material.save();
    res.status(201).json({ message: "Material added successfully", material });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Materials for a Course
exports.getMaterials = async (req, res) => {
  try {
    const { courseId } = req.params;
    const materials = await Material.find({ course: courseId }).populate("createdBy", "name email");

    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Material
exports.updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, fileUrl } = req.body;
    const { userId } = req.user;

    const material = await Material.findById(id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    if (String(material.createdBy) !== userId) {
      return res.status(403).json({ message: "You are not authorized to update this material" });
    }

    material.title = title || material.title;
    material.description = description || material.description;
    material.fileUrl = fileUrl || material.fileUrl;

    await material.save();
    res.status(200).json({ message: "Material updated successfully", material });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Delete Material
exports.deleteMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.user;

    const material = await Material.findById(id);
    if (!material) return res.status(404).json({ message: "Material not found" });

    if (String(material.createdBy) !== userId) {
      return res.status(403).json({ message: "You are not authorized to delete this material" });
    }

    await material.remove();
    res.status(200).json({ message: "Material deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
