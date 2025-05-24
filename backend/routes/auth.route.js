const express = require("express");
const {
  createUser,
  deleteUser,
  getAllUsers,
  getUserById,
  loginUser,
  restoreUser,
  updateUser,
  serveProfilePhoto,
  getCurrentUser,
  refreshToken,
logout,
  
} = require("../controllers/authController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");
const router = express.Router();

// Public routes (no authentication required)
router.post("/signup", createUser);
router.post("/login", loginUser);
router.get("/uploads/profilephotos/:filename", serveProfilePhoto);
router.get("/users", getAllUsers);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

  
  // Authenticated routes (require valid JWT)
router.use(authenticate);

// User management routes

router.get(
  "/user/:id",
  authorize(["admin", "teacher", "parent", "student"]),
  getUserById
);
router.put(
  "/users/:id",
  authorize(["admin", "teacher", "parent", "student"]),
  updateUser
);
router.delete("/users/:id", authorize(["admin"]), deleteUser);
router.post("/users/:id/restore", authorize(["admin"]), restoreUser);

// Role-specific routes
router.get("/teachers", authorize(["admin", "teacher"]), (req, res) => {
  // You might want to add a specific controller for this
  res.status(200).json({ message: "Teachers endpoint" });
});

router.get("/parents", authorize(["admin", "parent"]), (req, res) => {
  // You might want to add a specific controller for this
  res.status(200).json({ message: "Parents endpoint" });
});

router.get(
  "/students",
  authorize(["admin", "teacher", "parent"]),
  (req, res) => {
    // You might want to add a specific controller for this
    res.status(200).json({ message: "Students endpoint" });
  }
);
router.get("/current-user", getCurrentUser);


module.exports = router;
//const { authenticate, authorize } = require("../middleware/authMiddleware");

// // Public route (no authentication required)
// router.post("/users/login", userController.loginUser);

// // Protected routes (authentication required)
// router.post(
//   "/users",
//   authenticate,
//   authorize(["admin"]),
//   userController.createUser
// );
// router.get(
//   "/users",
//   authenticate,
//   authorize(["admin", "teacher"]),
//   userController.getAllUsers
// );
// router.get(
//   "/users/:id",
//   authenticate,
//   authorize(["admin", "teacher", "student", "parent"]),
//   userController.getUserById
// );
// router.put(
//   "/users/:id",
//   authenticate,
//   authorize(["admin", "teacher", "student", "parent"]),
//   userController.updateUser
// );
// router.delete(
//   "/users/:id",
//   authenticate,
//   authorize(["admin"]),
//   userController.deleteUser
// );

// module.exports = router;
