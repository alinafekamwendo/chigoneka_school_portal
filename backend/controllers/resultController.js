const { validationResult } = require("express-validator");
const { Result } = require("../models"); // Adjust the path as per your project structure

// Create a new result
const createResult = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { score, examId, studentId, assignmentId } = req.body;

  try {
    const newResult = await Result.create({
      score,
      examId,
      studentId,
      assignmentId,
    });
    res.status(201).json(newResult);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all results
const getResults = async (req, res) => {
  try {
    const results = await Result.findAll();
    res.status(200).json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single result by id
const getResultById = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Result.findByPk(id);
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a result
const updateResult = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { score, examId, studentId, assignmentId } = req.body;

  try {
    let result = await Result.findByPk(id);
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    result = await result.update({ score, examId, studentId, assignmentId });
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a result
const deleteResult = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await Result.findByPk(id);
    if (!result) {
      return res.status(404).json({ error: "Result not found" });
    }

    await result.destroy();
    res.status(204).json({ message: "Result deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createResult,
  getResults,
  getResultById,
  updateResult,
  deleteResult,
};
