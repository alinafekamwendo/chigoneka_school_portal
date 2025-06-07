// ChatParticipant model
module.exports = (sequelize, DataTypes) => {
  const ChatParticipant = sequelize.define(
    "ChatParticipant",
    {
      chatId: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: { model: "chats", key: "id" },
      },
      userId: {
        type: DataTypes.UUID,
        primaryKey: true,
        references: { model: "users", key: "id" },
      },
      role: {
        type: DataTypes.ENUM("admin", "member"),
        defaultValue: "member",
      },
      lastSeen: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: "chat_participants",
      timestamps: true,
    }
  );

  return ChatParticipant;
};
