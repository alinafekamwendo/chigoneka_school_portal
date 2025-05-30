module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
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
      parentId: {
        type: DataTypes.UUID,
        references: {
          model: "parents", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      alte_guardian_Id: {
        type: DataTypes.UUID,
        references: {
          model: "parents", // Table name
          key: "id",
        },
        allowNull: true,
        onDelete: "CASCADE", // Add this
      },
      currentClassId: {
        type: DataTypes.UUID,
        references: {
          model: "classes", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      admissionNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      paranoid: true,
      tableName: "students",
    }
  );

  Student.associate = (models) => {
    Student.belongsTo(models.User, {
      foreignKey: "userId",
      as: "user",
      onDelete: "CASCADE", // Add this
    });
    Student.belongsTo(models.Parent, {
      foreignKey: "parentId",
      as: "parent",
      onDelete: "CASCADE", // Add this
    });
    

  };
  return Student;
};

module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define(
    "Student",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
      },
      studentNumber: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        defaultValue: function () {
          const currentYear = new Date().getFullYear().toString().slice(-2);
          const randomNum = Math.floor(100 + Math.random() * 900);
          return `STUD-${randomNum}-${currentYear}`; // Generates like STUD-123-23
        },
      },
      parentId: {
        type: DataTypes.UUID,
        references: {
          model: "parents",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      alte_guardian_Id: {
        type: DataTypes.UUID,
        references: {
          model: "parents", // Table name
          key: "id",
        },
        allowNull: true,
        onDelete: "CASCADE", // Add this
      },
      currentClassId: {
        type: DataTypes.UUID,
        references: {
          model: "classes", // Table name
          key: "id",
        },
        onDelete: "CASCADE", // Add this
      },
      // ... rest of your student fields
    },
    {
      paranoid: true,
      tableName: "students",
    }
  );

  Student.associate = (models) => {
    Student.belongsTo(models.User, {
      foreignKey: "id",
      as: "user",
      onDelete: "CASCADE",
    });
    Student.belongsTo(models.Parent, {
      foreignKey: "parentId",
      as: "parent",
      onDelete: "CASCADE", // Add this
    });
    // ... rest of your associations
  };

  return Student;
};