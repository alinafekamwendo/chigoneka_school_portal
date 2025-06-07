const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const chatController = require("../controllers/chatController");
const {authenticate,authorize} = require("../middlewares/authMiddleware");

// Validation rules
const chatValidation = [
  check("type")
    .isIn(["private", "group", "class", "subject"])
    .withMessage("Invalid chat type"),
  check("participants").isArray().withMessage("Participants must be an array"),
  check("participants.*")
    .isUUID()
    .withMessage("Invalid user ID in participants"),
  check("classId").optional().isUUID().withMessage("Valid class ID required"),
  check("subjectId")
    .optional()
    .isUUID()
    .withMessage("Valid subject ID required"),
];

// Routes
router.post("/", authenticate, chatValidation, chatController.createChat);

router.get("/user/:userId", authenticate, chatController.getUserChats);

router.post(
  "/add-participants",
  authenticate,
  chatController.addParticipants
);

module.exports = router;
