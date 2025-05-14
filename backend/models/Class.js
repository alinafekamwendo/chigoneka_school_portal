module.exports = (sequelize, DataTypes) => {
  const Class = sequelize.define(
    "Class",
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
      capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      supervisorId: {
        type: DataTypes.UUID,
        references: {
          model: "teachers", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      gradeId: {
        type: DataTypes.UUID,
        references: {
          model: "grades", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
    },
    {
      tableName: "classes",
    }
  );

  Class.associate = (models) => {
    Class.belongsTo(models.Teacher, {
      foreignKey: "supervisorId",
      as: "supervisor",
      onDelete: "CASCADE", // Add this
    });
    Class.belongsTo(models.Grade, {
      foreignKey: "gradeId",
      as: "grade",
      onDelete: "CASCADE", // Add this
    });
    Class.hasMany(models.Student, {
      foreignKey: "currentClassId",
      as: "students",
    });
    
  };

  return Class;
};
