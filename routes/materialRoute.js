const express = require("express");
const {
  addMaterial,
  getMaterials,
  updateMaterial,
  deleteMaterial,
} = require("../controllers/materialController");
const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", protect(["Teacher"]), addMaterial);

router.get("/:courseId", protect(["Teacher", "Student"]), getMaterials);

router.put("/:id", protect(["Teacher"]), updateMaterial);

router.delete("/:id", protect(["Teacher"]), deleteMaterial);

module.exports = router;
