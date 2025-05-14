module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
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
      level: {
        type: DataTypes.ENUM("regular", "super"),
        allowNull: false,
        defaultValue: "regular",
      },
    },
    {
      paranoid: true, // Maintains soft delete consistency with User
      tableName: "admins", // Explicit table name
    }
  );

  // Define the association with User
  Admin.associate = function (models) {
    Admin.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE", // Add this
    });
  };

  return Admin;
};
