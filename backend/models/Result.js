module.exports = (sequelize, DataTypes) => {
  const Result = sequelize.define(
    "Result",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      examId: {
        type: DataTypes.UUID,
        references: {
          model: "exams", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      studentId: {
        type: DataTypes.UUID,
        references: {
          model: "students", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      assignmentId: {
        type: DataTypes.UUID,
        references: {
          model: "assignments", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
    },
    {
      tableName: "results",
    }
  );

  Result.associate = (models) => {
    Result.belongsTo(models.Exam, {
      foreignKey: "examId",
      as: "exam",
      onDelete: "CASCADE", // Add this
    });
    Result.belongsTo(models.Student, {
      foreignKey: "studentId",
      as: "student",
      onDelete: "CASCADE", // Add this
    });
    Result.belongsTo(models.Assignment, {
      foreignKey: "assignmentId",
      as: "assignment",
      onDelete: "CASCADE", // Add this
    });
  };

  return Result;
};
