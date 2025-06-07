// Department model for HOD assignment
module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define(
    "Department",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "departments",
    }
  );

  Department.associate = (models) => {
    Department.belongsTo(models.Teacher, {
      foreignKey: "hodId",
      as: "headOfDepartment",
    });
    Department.hasMany(models.Subject, {
      foreignKey: "departmentId",
      as: "subjects",
    });
  };

  return Department;
};
