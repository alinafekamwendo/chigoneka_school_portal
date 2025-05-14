const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Exam = sequelize.define(
    "Exam",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      startTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      endTime: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      lessonId: {
        type: DataTypes.UUID,
        references: {
          model: "lessons", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      paranoid: true, // Enables soft deletes
      tableName: "exams", // Explicit table name
    }
  );

  Exam.associate = (models) => {
    Exam.belongsTo(models.Lesson, {
      foreignKey: "lessonId",
      as: "lesson",
      onDelete: "CASCADE", // Add this
    });
  };

  return Exam;
};
