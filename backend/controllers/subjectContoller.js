const { validationResult } = require("express-validator");
const { Subject } = require("../models"); // Adjust the path as per your project structure

// Create a new subject
const createSubject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name } = req.body;

  try {
    const newSubject = await Subject.create({ name });
    res.status(201).json(newSubject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all subjects
const getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.findAll();
    res.status(200).json(subjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single subject by id
const getSubjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.status(200).json(subject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a subject
const updateSubject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name } = req.body;

  try {
    let subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    subject = await subject.update({ name });
    res.status(200).json(subject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a subject
const deleteSubject = async (req, res) => {
  const { id } = req.params;

  try {
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }

    await subject.destroy();
    res.status(204).json({ message: "Subject deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createSubject,
  getSubjects,
  getSubjectById,
  updateSubject,
  deleteSubject,
};
