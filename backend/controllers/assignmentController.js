const { validationResult } = require("express-validator");
const { Assignment } = require("../models"); // Adjust the path as per your project structure

// Create a new assignment
const createAssignment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, startDate, dueDate, lessonId } = req.body;

  try {
    const newAssignment = await Assignment.create({
      title,
      startDate,
      dueDate,
      lessonId,
    });
    res.status(201).json(newAssignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all assignments
const getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll();
    res.status(200).json(assignments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single assignment by id
const getAssignmentById = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }
    res.status(200).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update an assignment
const updateAssignment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, startDate, dueDate, lessonId } = req.body;

  try {
    let assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    assignment = await assignment.update({
      title,
      startDate,
      dueDate,
      lessonId,
    });
    res.status(200).json(assignment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete an assignment
const deleteAssignment = async (req, res) => {
  const { id } = req.params;

  try {
    const assignment = await Assignment.findByPk(id);
    if (!assignment) {
      return res.status(404).json({ error: "Assignment not found" });
    }

    await assignment.destroy();
    res.status(204).json({ message: "Assignment deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createAssignment,
  getAssignments,
  getAssignmentById,
  updateAssignment,
  deleteAssignment,
};
