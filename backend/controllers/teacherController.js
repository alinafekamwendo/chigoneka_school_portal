const {
  User,
  Teacher,
  TeachingAssignment,
  Department,
  Subject,
  Class,
  Term,
  SchoolYear,
} = require("../models");
const { validationResult } = require("express-validator");
const { sequelize } = require("../models");
const bcrypt = require("bcryptjs");

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
        role: "teacher",
        profilePhoto,
      },
      { transaction }
    );


    // Then create the Teacher with the same ID as User
    const teacher = await Teacher.create(
      {
        id: user.id, // Using same ID as user
        qualifications: qualifications || [],
        subjects: subjects || [],
      },
      { transaction }
    );

    await transaction.commit();

    // Return combined data with staff number
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
      staffNumber: teacher.staffNumber,
      qualifications: teacher.qualifications,
      subjects: teacher.subjects,
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

    res.status(500).json({ error: "Failed to create teacher" });
  }
};

// Get all teachers with basic user info and staff numbers
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      attributes: ["id", "staffNumber", "qualifications", "subjects"],
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
            "address",
            "sex",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
    });

    // Transform the data to a more client-friendly format
    const formattedTeachers = teachers.map((teacher) => ({
      id: teacher.id,
      staffNumber: teacher.staffNumber,
      qualifications: teacher.qualifications,
      subjects: teacher.subjects,

      ...teacher.user.get({ plain: true }),
    }));

    res.status(200).json(formattedTeachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teachers" });
  }
};

// Get teacher by ID with staff number
const getTeacherById = async (req, res) => {
  try {
    const teacher = await Teacher.findByPk(req.params.id, {
      attributes: ["id", "staffNumber", "qualifications", "subjects"],
      include: [
        {
          model: User,
          as: "user",
          attributes: [
            "id",
            "firstName",
            "lastName",
            "username",
            "email",
            "phone",
            "profilePhoto",
            "sex",
            "address",
            "isActive",
            "createdAt",
            "updatedAt",
          ],
        },
      ],
    });

    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Construct the response object with staff number
    const response = {
      id: teacher.id,
      staffNumber: teacher.staffNumber,
      qualifications: teacher.qualifications,
      subjects: teacher.subjects,
      ...teacher.user.get({ plain: true }),
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
    const teacher = await Teacher.findByPk(req.params.id, { transaction });
    if (!teacher) {
      await transaction.rollback();
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Since we're using shared IDs, we can find the user by the same ID
    const user = await User.findByPk(teacher.id, { transaction });
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
      isActive,
      address,
      sex,
      profilePhoto,
      qualifications,
      subjects,
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
    if (isActive !== undefined) userUpdateFields.isActive = isActive;
    if (profilePhoto !== undefined)
      userUpdateFields.profilePhoto = profilePhoto;

    // Prepare teacher update fields
    const teacherUpdateFields = {};
    if (qualifications !== undefined)
      teacherUpdateFields.qualifications = qualifications;
    if (subjects !== undefined) teacherUpdateFields.subjects = subjects;

    // Update both records
    await user.update(userUpdateFields, { transaction });
    await teacher.update(teacherUpdateFields, { transaction });

    // Reload both records to get updated data
    await user.reload({ transaction });
    await teacher.reload({ transaction });

    await transaction.commit();

    // Construct response with staff number
    const response = {
      id: teacher.id,
      staffNumber: teacher.staffNumber,
      qualifications: teacher.qualifications,
      subjects: teacher.subjects,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      email: user.email,
      phone: user.phone,
      address: user.address,
      sex: user.sex,
      profilePhoto: user.profilePhoto,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
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
    // Find teacher by ID (which is the same as user ID)
    const teacher = await Teacher.findByPk(req.params.id, { transaction });
    if (!teacher) {
      await transaction.rollback();
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Find user by the same ID
    const user = await User.findByPk(teacher.id, { transaction });
    if (!user) {
      await transaction.rollback();
      return res.status(404).json({ error: "Associated user not found" });
    }

    // Delete both records
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


const assignTeacherDuties = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { teacherId, duties } = req.body;
    const teacher = await Teacher.findByPk(teacherId, { transaction });

    if (!teacher) {
      await transaction.rollback();
      return res.status(404).json({ error: "Teacher not found" });
    }

    // Process different duty types
    for (const duty of duties) {
      switch (duty.type) {
        case "HOD":
          await Department.update(
            { hodId: teacherId },
            { where: { id: duty.departmentId }, transaction }
          );
          break;

        case "supervisor":
          await Class.update(
            { supervisorId: teacherId },
            { where: { id: duty.classId }, transaction }
          );
          break;

        case "teaching":
          // Validate assignment uniqueness
          const existing = await TeachingAssignment.findOne({
            where: {
              subjectId: duty.subjectId,
              classId: duty.classId,
              termId: duty.termId,
              schoolYearId: duty.schoolYearId,
            },
            transaction,
          });

          if (existing && existing.teacherId !== teacherId) {
            throw new Error("Subject already assigned to another teacher");
          }

          // Create or update assignment
          await TeachingAssignment.upsert(
            {
              teacherId,
              subjectId: duty.subjectId,
              classId: duty.classId,
              termId: duty.termId,
              schoolYearId: duty.schoolYearId,
              isHOD: duty.isHOD || false,
            },
            { transaction }
          );
          break;
      }
    }

    await transaction.commit();
    res.status(200).json({ message: "Duties assigned successfully" });
  } catch (err) {
    await transaction.rollback();
    console.error(err);
    res.status(500).json({
      error: "Failed to assign duties",
      message: err.message,
    });
  }
};

const getTeacherAssignments = async (req, res) => {
  try {
    const assignments = await TeachingAssignment.findAll({
      where: { teacherId: req.params.id },
      include: [
        { model: Subject, as: "subject" },
        { model: Class, as: "class" },
        { model: Term, as: "term" },
        { model: SchoolYear, as: "schoolYear" },
      ],
    });

    res.status(200).json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch teacher assignments" });
  }
};


module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
  getTeacherAssignments,
  assignTeacherDuties,
};
