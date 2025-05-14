module.exports = (sequelize, DataTypes) => {
  const StudentGrade = sequelize.define(
    "StudentGrade",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "students", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      subjectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "subjects", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      termId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "terms", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      schoolYearId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "school_years", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      score: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      grade: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      tableName: "student_grades",
    }
  );

  return StudentGrade;
};
