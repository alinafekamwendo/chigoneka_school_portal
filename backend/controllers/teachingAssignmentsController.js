const {
  TeachingAssignment,
  Subject,
  Teacher,
  Class,
  Term,
  SchoolYear,
} = require("../models");
const { sequelize } = require("../models");

// Create a teaching assignment
const createAssignment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { teacherId, subjectId, classId, termId, schoolYearId, isHOD } =
      req.body;

    // Validate uniqueness
    const existing = await TeachingAssignment.findOne({
      where: {
        subjectId,
        classId,
        termId,
        schoolYearId,
      },
      transaction,
    });

    if (existing) {
      throw new Error(
        "This subject/class/term/year combination is already assigned"
      );
    }

    const assignment = await TeachingAssignment.create(
      {
        teacherId,
        subjectId,
        classId,
        termId,
        schoolYearId,
        isHOD: isHOD || false,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json(assignment);
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// Get all teaching assignments
const getAssignments = async (req, res) => {
  try {
    const assignments = await TeachingAssignment.findAll({
      include: [
        {
          model: Teacher,
          as: "teacher",
          include: [{ model: User, as: "user" }],
        },
        { model: Subject, as: "subject" },
        { model: Class, as: "class" },
        { model: Term, as: "term" },
        { model: SchoolYear, as: "schoolYear" },
      ],
    });
    res.status(200).json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch assignments" });
  }
};

// Update a teaching assignment
const updateAssignment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const assignment = await TeachingAssignment.findByPk(req.params.id, {
      transaction,
    });

    if (!assignment) {
      await transaction.rollback();
      return res.status(404).json({ error: "Assignment not found" });
    }

    const { teacherId, isHOD } = req.body;

    // Only allow changing teacher or HOD status
    if (teacherId) assignment.teacherId = teacherId;
    if (isHOD !== undefined) assignment.isHOD = isHOD;

    await assignment.save({ transaction });
    await transaction.commit();

    res.status(200).json(assignment);
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to update assignment" });
  }
};

// Delete a teaching assignment
const deleteAssignment = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const assignment = await TeachingAssignment.findByPk(req.params.id, {
      transaction,
    });

    if (!assignment) {
      await transaction.rollback();
      return res.status(404).json({ error: "Assignment not found" });
    }

    await assignment.destroy({ transaction });
    await transaction.commit();

    res.status(204).end();
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to delete assignment" });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  updateAssignment,
  deleteAssignment,
};
