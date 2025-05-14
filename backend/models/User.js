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
    },
    {
      paranoid: true, // Enables soft deletes
      tableName: "users", // Explicit table name
    }
  );
  User.associate = (models) => {
    User.hasOne(models.Teacher, {
      foreignKey: "userId",
      as: "teacher",
      onDelete: "CASCADE",
    });
    User.hasOne(models.Parent, {
      foreignKey: "userId",
      as: "parent",
      onDelete: "CASCADE",
    });
    User.hasOne(models.Student, {
      foreignKey: "userId",
      as: "student",
      onDelete: "CASCADE",
    });
    User.hasOne(models.Admin, {
      foreignKey: "userId",
      as: "admin",
      onDelete: "CASCADE",
    });
  };

  return User;
};
