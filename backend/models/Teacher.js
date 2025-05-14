module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    "Teacher",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      qualifications: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      subjects: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
    },
    {
      paranoid: true,
      tableName: "teachers",
    }
  );

  Teacher.associate = (models) => {
    Teacher.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE", // Add this
    });
    Teacher.hasMany(models.Lesson, {
      foreignKey: "teacherId",
      as: "lessons",
      onDelete: "CASCADE", // Add this
    });
  };

  return Teacher;
};
