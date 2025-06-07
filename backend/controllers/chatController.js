const { Chat, User, Class, Subject, ChatParticipant } = require("../models");
const { sequelize } = require("../models");

// Create a new chat
const createChat = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { type, participants, classId, subjectId, name } = req.body;

    const chat = await Chat.create(
      {
        type,
        classId: type === "class" ? classId : null,
        subjectId: type === "subject" ? subjectId : null,
        name: type !== "private" ? name : null,
      },
      { transaction }
    );

    // Add participants
    for (const userId of participants) {
      await ChatParticipant.create(
        {
          chatId: chat.id,
          userId,
          role: "member",
        },
        { transaction }
      );
    }

    await transaction.commit();
    res.status(201).json(chat);
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to create chat" });
  }
};

// Get all chats for a user
const getUserChats = async (req, res) => {
  try {
    const userId = req.params.userId;

    const chats = await ChatParticipant.findAll({
      where: { userId },
      include: [
        {
          model: Chat,
          as: "chat",
          include: [
            { model: Class, as: "class" },
            { model: Subject, as: "subject" },
            {
              model: ChatParticipant,
              as: "participants",
              include: [{ model: User, as: "user" }],
            },
          ],
        },
      ],
    });

    res.status(200).json(chats.map((p) => p.chat));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chats" });
  }
};

// Add participants to a chat
const addParticipants = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { chatId, participants } = req.body;

    for (const userId of participants) {
      await ChatParticipant.findOrCreate({
        where: { chatId, userId },
        defaults: { role: "member" },
        transaction,
      });
    }

    await transaction.commit();
    res.status(200).json({ message: "Participants added successfully" });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to add participants" });
  }
};

module.exports = {
  createChat,
  getUserChats,
  addParticipants,
};
