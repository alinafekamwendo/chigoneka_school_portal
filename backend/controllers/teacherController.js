const { User, Teacher } = require("../models");
const { validationResult } = require("express-validator");
const { sequelize } = require("../models");

// Create a new teacher (and associated user)
const createTeacher = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      password,
      phone,
      address,
      sex,
      qualifications,
      subjects,
      profilePhoto,
    } = req.body;

    // First create the User
    const user = await User.create(
      {
        firstName,
        lastName,
        username,
        email,
        password,
        phone,
        address,
        sex,
        role: "teacher",
        profilePhoto,
      },
      { transaction }
    );

    // Then create the Teacher with the User's ID
    const teacher = await Teacher.create(
      {
        userId: user.id,
        qualifications: qualifications || [],
        subjects: subjects || [],
      },
      { transaction }
    );

    await transaction.commit();

    // Return combined data (excluding sensitive info)
    const response = {
      ...user.get({ plain: true }),
      teacherInfo: teacher.get({ plain: true }),
    };
    delete response.password;

    res.status(201).json(response);
  } catch (err) {
    await transaction.rollback();
    console.error(err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Username or email already exists",
      });
    }

    res.status(500).json({ error: "Failed to create teacher" });
  }
};

// Get all teachers with basic user info
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "profilePhoto",
          ],
        },
      ],
    });

    res.status(200).json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
};

const getTeacherById = async (req, res) => {
  try {
    // First find the teacher record that belongs to this user
    const teacher = await Teacher.findOne({
      where: { userId: req.params.id },
      attributes: ["id", "qualifications", "subjects"],
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "email",
            "phone",
            "profilePhoto",
            "sex",
            "address",
          ],
        },
      ],
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found for this user" });
    }

    // Construct the response object
    const response = {
      id: teacher.id,
      qualifications: teacher.qualifications,
      subjects: teacher.subjects,
      user: {
        id: teacher.user.id,
        firstName: teacher.user.firstName,
        lastName: teacher.user.lastName,
        email: teacher.user.email,
        phone: teacher.user.phone,
        profilePhoto: teacher.user.profilePhoto,
        sex: teacher.user.sex,
        address: teacher.user.address,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching teacher:", err);
    res.status(500).json({
      error: "Failed to fetch teacher details",
      details: err.message,
    });
  }
};

// Update teacher information
const updateTeacher = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();
  try {
    // First find the teacher record associated with this user ID
    const teacher = await Teacher.findOne({
      where: { userId: req.params.id },
      transaction,
    });

    if (!teacher) {
      await transaction.rollback();
      return res.status(404).json({ error: "Teacher not found for this user" });
    }

    // Update user info
    const user = await User.findByPk(req.params.id, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: "User not found" });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      qualifications,
      subjects,
      sex, // Added sex since it's in your user model
    } = req.body;

    await user.update(
      {
        firstName,
        lastName,
        email,
        phone,
        address,
        sex, // Include sex in the update
      },
      { transaction }
    );

    // Update teacher-specific info
    await teacher.update(
      {
        qualifications: qualifications || [],
        subjects: subjects || [],
      },
      { transaction }
    );

    await transaction.commit();

    // Construct response without sensitive data
    const response = {
      id: teacher.id,
      qualifications: teacher.qualifications,
      subjects: teacher.subjects,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
        address: user.address,
        sex: user.sex,
        profilePhoto: user.profilePhoto,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };

    res.status(200).json(response);
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating teacher:", err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Username or email already exists",
        details: err.errors?.map((e) => e.message) || err.message,
      });
    }

    res.status(500).json({
      error: "Failed to update teacher",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Delete a teacher and associated user
const deleteTeacher = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const teacher = await Teacher.findByPk(req.params.id, { transaction });
    if (!teacher) {
      await transaction.rollback();
      return res.status(404).json({ error: "Teacher not found" });
    }

    const user = await User.findByPk(teacher.userId, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: "Associated user not found" });
    }

    await teacher.destroy({ transaction });
    await user.destroy({ transaction });

    await transaction.commit();
    res.status(204).end();
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to delete teacher" });
  }
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
