module.exports = (sequelize, DataTypes) => {
  const Lesson = sequelize.define(
    "Lesson",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      day: {
        type: DataTypes.ENUM(
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday"
        ),
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
      subjectId: {
        type: DataTypes.UUID,
        references: {
          model: "subjects", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      classId: {
        type: DataTypes.UUID,
        references: {
          model: "classes", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      teacherId: {
        type: DataTypes.UUID,
        references: {
          model: "teachers", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
    },
    {
      tableName: "lessons",
    }
  );

  Lesson.associate = (models) => {
    Lesson.belongsTo(models.Subject, {
      foreignKey: "subjectId",
      as: "subject",
      onDelete: "CASCADE", // Add this
    });
    Lesson.belongsTo(models.Class, {
      foreignKey: "classId",
      as: "class",
      onDelete: "CASCADE", // Add this
    });
    Lesson.belongsTo(models.Teacher, {
      foreignKey: "teacherId",
      as: "teacher",
      onDelete: "CASCADE", // Add this
    });
    Lesson.hasMany(models.Exam, {
      foreignKey: "lessonId",
      as: "exams",
      onDelete: "CASCADE", // Add this
    });
  };

  return Lesson;
};
