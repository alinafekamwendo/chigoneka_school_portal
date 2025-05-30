const { DataTypes } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      role: {
        type: DataTypes.ENUM("admin", "parent", "teacher", "student"),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      phone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: true,
      },
      sex: {
        type: DataTypes.ENUM("MALE", "FEMALE"),
        allowNull: false,
      },
      profilePhoto: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      // ... (rest of your existing User fields remain the same)
    },
    {
      paranoid: true,
      tableName: "users",
    }
  );

  User.associate = (models) => {
    User.hasOne(models.Teacher, {
      foreignKey: "id", // Changed from userId to id to share same ID
      as: "teacher",
      onDelete: "CASCADE",
    });
    User.hasOne(models.Parent, {
      foreignKey: "id", // Changed from userId to id
      as: "parent",
      onDelete: "CASCADE",
    });
    User.hasOne(models.Student, {
      foreignKey: "id", // Changed from userId to id
      as: "student",
      onDelete: "CASCADE",
    });
    User.hasOne(models.Admin, {
      foreignKey: "id", // Changed from userId to id
      as: "admin",
      onDelete: "CASCADE",
    });
  };

  return User;
};