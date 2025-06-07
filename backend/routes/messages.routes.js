const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const messageController = require("../controllers/messageController");
const { authenticate, authorize } = require("../middlewares/authMiddleware");

// Validation rules
const messageValidation = [
  check("chatId").isUUID().withMessage("Valid chat ID required"),
  check("content").notEmpty().withMessage("Message content is required"),
  check("parentMessageId")
    .optional()
    .isUUID()
    .withMessage("Valid parent message ID required"),
];

// Routes
router.post(
  "/",
  authenticate,
  messageValidation,
  messageController.sendMessage
);

router.get("/chat/:chatId", authenticate, messageController.getChatMessages);

router.post(
  "/reply/:messageId",
  authenticate,
  [check("content").notEmpty().withMessage("Reply content is required")],
  messageController.replyToMessage
);

module.exports = router;
