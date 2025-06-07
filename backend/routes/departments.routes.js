const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const departmentController = require("../controllers/departmentController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

// Validation rules
const departmentValidation = [
  check("name").notEmpty().withMessage("Department name is required"),
];

const hodValidation = [
  check("departmentId").isUUID().withMessage("Valid department ID required"),
  check("teacherId").isUUID().withMessage("Valid teacher ID required"),
];

// Routes
router.post(
  "/",
  authenticate,
  authorize(["admin"]), // Only admins can create departments
  departmentValidation,
  departmentController.createDepartment
);

router.post(
  "/assign-hod",
  authenticate,
  authorize(["admin"]), // Only admins can assign HODs
  hodValidation,
  departmentController.assignHOD
);

router.get("/", authenticate, departmentController.getDepartments);

module.exports = router;
