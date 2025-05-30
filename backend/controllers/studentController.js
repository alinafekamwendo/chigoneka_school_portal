const { validationResult } = require("express-validator");
const { Student, User, Parent } = require("../models");
const { sequelize } = require("../models");
const bcrypt = require("bcryptjs");

// Create a new student (and associated user)
const createStudent = async (req, res) => {
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
      profilePhoto,
      bloodType,
      birthday,
      parentId,
      alte_guardian_Id,
      currentClassId,
    } = req.body;

    // Verify parent exists
    const parent = await Parent.findByPk(parentId, { transaction });
    if (!parent) {
      await transaction.rollback();
      return res.status(404).json({ error: "Parent not found" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // First create the User
    const user = await User.create(
      {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
        phone,
        address,
        sex,
        role: "student",
        profilePhoto,
      },
      { transaction }
    );

    // Then create the Student with the same ID as User
    const student = await Student.create(
      {
        id: user.id, // Using same ID as user
        parentId,
        alte_guardian_Id: alte_guardian_Id || null,
        currentClassId,
        bloodType,
        birthday,
        admissionNumber: generateAdmissionNumber(), // Generate STUD-XX-YY format
      },
      { transaction }
    );

    await transaction.commit();

    // Return combined data with student number
    const response = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      sex: user.sex,
      profilePhoto: user.profilePhoto,
      role: user.role,
      studentNumber: student.admissionNumber,
      bloodType: student.bloodType,
      birthday: student.birthday,
      parentId: student.parentId,
      alte_guardian_Id: student.alte_guardian_Id,
      currentClassId: student.currentClassId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(201).json(response);
  } catch (err) {
    await transaction.rollback();
    console.error(err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Username or email already exists",
      });
    }

    res.status(500).json({ error: "Failed to create student" });
  }
};

// Helper function to generate admission number (STUD-XX-YY)
function generateAdmissionNumber() {
  const currentYear = new Date().getFullYear().toString().slice(-2);
  const randomNum = Math.floor(100 + Math.random() * 900); // 3-digit random number
  return `STUD-${randomNum}-${currentYear}`;
}

// Get all students with basic user info and student numbers
const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll({
      attributes: [
        "id",
        "admissionNumber",
        "bloodType",
        "birthday",
        "parentId",
        "currentClassId",
      ],
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
            "address",
            "sex",
            "profilePhoto",
          ],
        },
        {
          model: Parent,
          as: "parent",
          attributes: ["parentNumber"],
        },
      ],
    });

    // Transform the data to a more client-friendly format
    const formattedStudents = students.map((student) => ({
      id: student.id,
      studentNumber: student.admissionNumber,
      bloodType: student.bloodType,
      birthday: student.birthday,
      parentId: student.parentId,
      parentNumber: student.parent?.parentNumber,
      currentClassId: student.currentClassId,
      ...student.user.get({ plain: true }),
    }));

    // Add profile photo URLs
    formattedStudents.forEach((student) => {
      if (student.profilePhoto) {
        student.profilePhoto = `${req.protocol}://${req.get("host")}${
          student.profilePhoto
        }`;
      }
    });

    res.status(200).json(formattedStudents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

// Get student by ID with student number
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      attributes: [
        "id",
        "admissionNumber",
        "bloodType",
        "birthday",
        "parentId",
        "currentClassId",
      ],
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
            "address",
            "sex",
            "profilePhoto",
          ],
        },
        {
          model: Parent,
          as: "parent",
          attributes: ["parentNumber"],
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Construct the response object with student number
    const response = {
      id: student.id,
      studentNumber: student.admissionNumber,
      bloodType: student.bloodType,
      birthday: student.birthday,
      parentId: student.parentId,
      parentNumber: student.parent?.parentNumber,
      currentClassId: student.currentClassId,
      ...student.user.get({ plain: true }),
    };

    // Add profile photo URL if exists
    if (response.profilePhoto) {
      response.profilePhoto = `${req.protocol}://${req.get("host")}${
        response.profilePhoto
      }`;
    }

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching student:", err);
    res.status(500).json({
      error: "Failed to fetch student details",
      details: err.message,
    });
  }
};

// Update student information
const updateStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const transaction = await sequelize.transaction();
  try {
    const student = await Student.findByPk(req.params.id, { transaction });
    if (!student) {
      await transaction.rollback();
      return res.status(404).json({ error: "Student not found" });
    }

    // Since we're using shared IDs, we can find the user by the same ID
    const user = await User.findByPk(student.id, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: "Associated user not found" });
    }

    const {
      firstName,
      lastName,
      username,
      email,
      phone,
      address,
      sex,
      profilePhoto,
      bloodType,
      birthday,
      parentId,
      alte_guardian_Id,
      currentClassId,
    } = req.body;

    // Prepare user update fields
    const userUpdateFields = {};
    if (firstName !== undefined) userUpdateFields.firstName = firstName;
    if (lastName !== undefined) userUpdateFields.lastName = lastName;
    if (username !== undefined) userUpdateFields.username = username;
    if (email !== undefined) userUpdateFields.email = email;
    if (phone !== undefined) userUpdateFields.phone = phone;
    if (address !== undefined) userUpdateFields.address = address;
    if (sex !== undefined) userUpdateFields.sex = sex;
    if (profilePhoto !== undefined)
      userUpdateFields.profilePhoto = profilePhoto;

    // Prepare student update fields
    const studentUpdateFields = {};
    if (bloodType !== undefined) studentUpdateFields.bloodType = bloodType;
    if (birthday !== undefined) studentUpdateFields.birthday = birthday;
    if (parentId !== undefined) studentUpdateFields.parentId = parentId;
    if (alte_guardian_Id !== undefined)
      studentUpdateFields.alte_guardian_Id = alte_guardian_Id;
    if (currentClassId !== undefined)
      studentUpdateFields.currentClassId = currentClassId;

    // Update both records
    await user.update(userUpdateFields, { transaction });
    await student.update(studentUpdateFields, { transaction });

    // Reload both records to get updated data
    await user.reload({ transaction });
    await student.reload({ transaction });

    await transaction.commit();

    // Construct response with student number
    const response = {
      id: student.id,
      studentNumber: student.admissionNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      sex: user.sex,
      profilePhoto: user.profilePhoto,
      role: user.role,
      bloodType: student.bloodType,
      birthday: student.birthday,
      parentId: student.parentId,
      alte_guardian_Id: student.alte_guardian_Id,
      currentClassId: student.currentClassId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    res.status(200).json(response);
  } catch (err) {
    await transaction.rollback();
    console.error("Error updating student:", err);

    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Username or email already exists",
        details: err.errors?.map((e) => e.message) || err.message,
      });
    }

    res.status(500).json({
      error: "Failed to update student",
      details: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

// Delete a student and associated user
const deleteStudent = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    // Find student by ID (which is the same as user ID)
    const student = await Student.findByPk(req.params.id, { transaction });
    if (!student) {
      await transaction.rollback();
      return res.status(404).json({ error: "Student not found" });
    }

    // Find user by the same ID
    const user = await User.findByPk(student.id, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: "Associated user not found" });
    }

    // Delete both records
    await student.destroy({ transaction });
    await user.destroy({ transaction });

    await transaction.commit();
    res.status(204).end();
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({ error: "Failed to delete student" });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
