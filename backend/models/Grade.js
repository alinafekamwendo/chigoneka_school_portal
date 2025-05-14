const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  const Grade = sequelize.define(
    "Grade",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true, // Ensure grade names are unique
      },
      level: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true, // Ensure grade levels are unique
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
      tableName: "grades", // Explicit table name
    }
  );

  Grade.associate = (models) => {
    // A Grade can have many Classes
    Grade.hasMany(models.Class, {
      foreignKey: "gradeId",
      as: "classes",
      onDelete: "CASCADE", // Add this
    });

    // A Grade can have many Students (if needed)
    Grade.hasMany(models.Student, {
      foreignKey: "gradeId",
      as: "students",
      onDelete: "CASCADE", // Add this
    });
  };

  return Grade;
};
