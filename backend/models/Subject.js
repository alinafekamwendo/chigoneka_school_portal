module.exports = (sequelize, DataTypes) => {
  const Subject = sequelize.define(
    "Subject",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      tableName: "subjects",
    }
  );

  Subject.associate = (models) => {
    Subject.belongsToMany(models.Teacher, {
      through: "SubjectToTeacher",
      foreignKey: "subjectId",
      as: "teachers",
      onDelete: "CASCADE", // Add this
    });
    Subject.belongsTo(models.Department, {
      foreignKey: "departmentId",
      as: "department",
    });
  };

  return Subject;
};
