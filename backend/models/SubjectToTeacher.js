module.exports = (sequelize, DataTypes) => {
  const SubjectToTeacher = sequelize.define(
    "SubjectToTeacher",
    {
      subjectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "subjects", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      teacherId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "teachers", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
    },
    {
      tableName: "subject_to_teachers",
    }
  );

  return SubjectToTeacher;
};
