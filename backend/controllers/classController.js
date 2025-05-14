const { validationResult } = require("express-validator");
const { Class } = require("../models"); // Adjust the path as per your project structure

// Create a new class
const createClass = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, capacity, supervisorId, gradeId } = req.body;

  try {
    const newClass = await Class.create({
      name,
      capacity,
      supervisorId,
      gradeId,
    });
    res.status(201).json(newClass);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all classes
const getClasses = async (req, res) => {
  try {
    const classes = await Class.findAll();
    res.status(200).json(classes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single class by id
const getClassById = async (req, res) => {
  const { id } = req.params;

  try {
    const classInstance = await Class.findByPk(id);
    if (!classInstance) {
      return res.status(404).json({ error: "Class not found" });
    }
    res.status(200).json(classInstance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a class
const updateClass = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { name, capacity, supervisorId, gradeId } = req.body;

  try {
    let classInstance = await Class.findByPk(id);
    if (!classInstance) {
      return res.status(404).json({ error: "Class not found" });
    }

    classInstance = await classInstance.update({
      name,
      capacity,
      supervisorId,
      gradeId,
    });
    res.status(200).json(classInstance);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a class
const deleteClass = async (req, res) => {
  const { id } = req.params;

  try {
    const classInstance = await Class.findByPk(id);
    if (!classInstance) {
      return res.status(404).json({ error: "Class not found" });
    }

    await classInstance.destroy();
    res.status(204).json({ message: "Class deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createClass,
  getClasses,
  getClassById,
  updateClass,
  deleteClass,
};
