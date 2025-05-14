const { validationResult } = require("express-validator");
const { Teacher } = require("../models"); // Adjust the path as per your project structure

// Create a new teacher
const createTeacher = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const {
    username,
    name,
    surname,
    email,
    phone,
    address,
    bloodType,
    sex,
    birthday,
  } = req.body;

  try {
    const teacher = await Teacher.create({
      username,
      name,
      surname,
      email,
      phone,
      address,
      bloodType,
      sex,
      birthday,
    });
    res.status(201).json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all teachers
const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.findAll();
    res.status(200).json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single teacher by id
const getTeacherById = async (req, res) => {
  const { id } = req.params;

  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }
    res.status(200).json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a teacher
const updateTeacher = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const {
    username,
    name,
    surname,
    email,
    phone,
    address,
    bloodType,
    sex,
    birthday,
  } = req.body;

  try {
    let teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    teacher = await teacher.update({
      username,
      name,
      surname,
      email,
      phone,
      address,
      bloodType,
      sex,
      birthday,
    });
    res.status(200).json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a teacher
const deleteTeacher = async (req, res) => {
  const { id } = req.params;

  try {
    const teacher = await Teacher.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ error: "Teacher not found" });
    }

    await teacher.destroy();
    res.status(204).json({ message: "Teacher deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createTeacher,
  getTeachers,
  getTeacherById,
  updateTeacher,
  deleteTeacher,
};
