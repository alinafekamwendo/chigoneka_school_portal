const { validationResult } = require("express-validator");
const { Exam } = require("../models"); // Adjust the path as per your project structure

// Create a new exam
const createExam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, startTime, endTime, lessonId } = req.body;

  try {
    const newExam = await Exam.create({ title, startTime, endTime, lessonId });
    res.status(201).json(newExam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all exams
const getExams = async (req, res) => {
  try {
    const exams = await Exam.findAll();
    res.status(200).json(exams);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single exam by id
const getExamById = async (req, res) => {
  const { id } = req.params;

  try {
    const exam = await Exam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }
    res.status(200).json(exam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update an exam
const updateExam = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, startTime, endTime, lessonId } = req.body;

  try {
    let exam = await Exam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    exam = await exam.update({ title, startTime, endTime, lessonId });
    res.status(200).json(exam);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete an exam
const deleteExam = async (req, res) => {
  const { id } = req.params;

  try {
    const exam = await Exam.findByPk(id);
    if (!exam) {
      return res.status(404).json({ error: "Exam not found" });
    }

    await exam.destroy();
    res.status(204).json({ message: "Exam deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
};
