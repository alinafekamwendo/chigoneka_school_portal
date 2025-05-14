const { validationResult } = require("express-validator");
const { Student } = require("../models"); // Adjust the path as per your project structure

// Create a new student
const createStudent = async (req, res) => {
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
    img,
    bloodType,
    sex,
    birthday,
    parentId,
  } = req.body;

  try {
    const newStudent = await Student.create({
      username,
      name,
      surname,
      email,
      phone,
      address,
      img,
      bloodType,
      sex,
      birthday,
      parentId,
    });
    res.status(201).json(newStudent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.findAll();
    res.status(200).json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single student by id
const getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.status(200).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a student
const updateStudent = async (req, res) => {
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
    img,
    bloodType,
    sex,
    birthday,
    parentId,
  } = req.body;

  try {
    let student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    student = await student.update({
      username,
      name,
      surname,
      email,
      phone,
      address,
      img,
      bloodType,
      sex,
      birthday,
      parentId,
    });
    res.status(200).json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a student
const deleteStudent = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await Student.findByPk(id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await student.destroy();
    res.status(204).json({ message: "Student deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
