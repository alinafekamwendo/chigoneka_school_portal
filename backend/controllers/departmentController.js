const { Department, Teacher, Subject } = require("../models");
const { sequelize } = require("../models");

// Create a department
const createDepartment = async (req, res) => {
  try {
    const { name } = req.body;
    const department = await Department.create({ name });
    res.status(201).json(department);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create department" });
  }
};

// Assign HOD to department
const assignHOD = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { departmentId, teacherId } = req.body;

    const department = await Department.findByPk(departmentId, { transaction });
    const teacher = await Teacher.findByPk(teacherId, { transaction });

    if (!department || !teacher) {
      await transaction.rollback();
      return res.status(404).json({ error: "Department or teacher not found" });
    }

    department.hodId = teacherId;
    await department.save({ transaction });

    await transaction.commit();
    res.status(200).json(department);
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to assign HOD" });
  }
};

// Get all departments with HOD information
const getDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      include: [
        {
          model: Teacher,
          as: "headOfDepartment",
          include: [{ model: User, as: "user" }],
        },
        { model: Subject, as: "subjects" },
      ],
    });
    res.status(200).json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch departments" });
  }
};

module.exports = {
  createDepartment,
  assignHOD,
  getDepartments,
};
