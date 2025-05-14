module.exports = (sequelize, DataTypes) => {
  const Parent = sequelize.define(
    "Parent",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
    },
    {
      paranoid: true,
      tableName: "parents",
    }
  );

  Parent.associate = (models) => {
    Parent.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE", // Add this
    });
    Parent.hasMany(models.Student, {
      foreignKey: "parentId",
      as: "students",
      onDelete: "CASCADE", // Add this
    });
  };

  return Parent;
};
