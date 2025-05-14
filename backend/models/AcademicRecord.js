module.exports = (sequelize, DataTypes) => {
  const AcademicRecord = sequelize.define(
    "AcademicRecord",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      studentId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "students", key: "id" },
        onDelete: "CASCADE",
      },
      classId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "classes", key: "id" },
        onDelete: "CASCADE",
      },
      subjectId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "subjects", key: "id" },
        onDelete: "CASCADE",
      },
      termId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "terms", key: "id" },
        onDelete: "CASCADE",
      },
      academicYearId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: { model: "school_years", key: "id" },
        onDelete: "CASCADE",
      },
      score: {
        type: DataTypes.DECIMAL(5, 2), // e.g., 99.99
        allowNull: false,
        validate: { min: 0, max: 100 },
      },
      grade: {
        type: DataTypes.STRING(2), // e.g., 'A', 'B+'
        allowNull: false,
      },
      isPromoted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      paranoid: true,
      tableName: "academic_records",
      indexes: [
        // Composite unique constraint
        {
          unique: true,
          name: "academic_rec_unique",
          fields: [
            "studentId",
            "classId",
            "subjectId",
            "termId",
            "academicYearId",
          ],
        },
      ],
    }
  );

  AcademicRecord.associate = (models) => {
    AcademicRecord.belongsTo(models.Student, {
      foreignKey: "studentId",
      as: "student",
    });
    AcademicRecord.belongsTo(models.Class, {
      foreignKey: "classId",
      as: "class",
    });
    AcademicRecord.belongsTo(models.Subject, {
      foreignKey: "subjectId",
      as: "subject",
    });
    AcademicRecord.belongsTo(models.Term, { foreignKey: "termId", as: "term" });
    AcademicRecord.belongsTo(models.SchoolYear, {
      foreignKey: "academicYearId",
      as: "academicYear",
    });
  };

  return AcademicRecord;
};
