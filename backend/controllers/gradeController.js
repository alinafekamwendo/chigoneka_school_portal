const { validationResult } = require("express-validator");
const { Grade } = require("../models"); // Adjust the path as per your project structure

// Create a new grade
const createGrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { level } = req.body;

  try {
    const newGrade = await Grade.create({ level });
    res.status(201).json(newGrade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all grades
const getGrades = async (req, res) => {
  try {
    const grades = await Grade.findAll();
    res.status(200).json(grades);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single grade by id
const getGradeById = async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }
    res.status(200).json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a grade
const updateGrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { level } = req.body;

  try {
    let grade = await Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    grade = await grade.update({ level });
    res.status(200).json(grade);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a grade
const deleteGrade = async (req, res) => {
  const { id } = req.params;

  try {
    const grade = await Grade.findByPk(id);
    if (!grade) {
      return res.status(404).json({ error: "Grade not found" });
    }

    await grade.destroy();
    res.status(204).json({ message: "Grade deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createGrade,
  getGrades,
  getGradeById,
  updateGrade,
  deleteGrade,
};
