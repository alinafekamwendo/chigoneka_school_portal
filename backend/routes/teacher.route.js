const express = require("express");
const teacherController = require("../controllers/teacherController"); // Assuming your controller is in a 'controllers' folder
const router = express.Router();
const { authenticate, authorize } = require("../middlewares/authMiddleware");



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

// New routes for teacher assignments
router.get('/:id/assignments', 
  authenticate,
  authorize(['teacher', 'admin']), // Only teachers and admins can access 
  teacherController.getTeacherAssignments
);

router.post('/:id/assign-duties', 
  authenticate,
  authorize(['admin']), // Only admins can assign duties
  teacherController.assignTeacherDuties
);

module.exports = router;
