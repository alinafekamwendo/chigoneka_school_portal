const express = require("express");
const { body } = require("express-validator");
const teacherController = require("../controllers/teacherController"); // Assuming your controller is in a 'controllers' folder
const router = express.Router();



// Route to create a new teacher (and associated user)
router.post(
  "/create",
  teacherController.createTeacher
);

// Route to get all teachers with basic user info
router.get("/", teacherController.getTeachers);

// Route to get a single teacher by ID (teacher-specific info)
router.get("/:id", teacherController.getTeacherById);

// Route to update teacher information
router.put(
  "/:id",
  teacherController.updateTeacher
);

// Route to delete a teacher and associated user
router.delete("/:id", teacherController.deleteTeacher);

module.exports = router;
