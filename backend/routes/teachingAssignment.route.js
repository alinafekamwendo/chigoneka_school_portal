const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const assignmentController = require("../controllers/teachingAssignmentsController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

// Validation rules
const assignmentValidation = [
  check("teacherId").isUUID().withMessage("Valid teacher ID required"),
  check("subjectId").isUUID().withMessage("Valid subject ID required"),
  check("classId").isUUID().withMessage("Valid class ID required"),
  check("termId").isUUID().withMessage("Valid term ID required"),
  check("schoolYearId").isUUID().withMessage("Valid school year ID required"),
];

// Routes
router.post(
  "/",
    authenticate,
    authorize(["admin", "teacher"]), // Only admins and teachers can create assignments
  assignmentValidation,
  assignmentController.createAssignment
);

router.get("/", authenticate, assignmentController.getAssignments);

router.put(
  "/:id",
    authenticate,
    assignmentValidation,
    authorize(["admin", "teacher"]), // Only admins and teachers can update assignments
  assignmentController.updateAssignment
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin", "teacher"]), // Only admins and teachers can delete assignments
  assignmentController.deleteAssignment
);

module.exports = router;
