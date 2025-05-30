const { DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Teacher = sequelize.define(
    "Teacher",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true, // Remove defaultValue since it will come from User
      },
      staffNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        defaultValue: () => `STAF${Math.floor(1000 + Math.random() * 9000)}`, // Generates like STAF1234
      },
      qualifications: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      subjects: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
    },
    {
      paranoid: true,
      tableName: "teachers",
    }
  );

  Teacher.associate = (models) => {
    Teacher.belongsTo(models.User, {
      foreignKey: "id",
      as: "user",
      onDelete: "CASCADE",
    });
    Teacher.hasMany(models.Lesson, {
      foreignKey: "teacherId",
      as: "lessons",
      onDelete: "CASCADE", // Add this
    });
    // ... rest of your associations
  };

  return Teacher;
};