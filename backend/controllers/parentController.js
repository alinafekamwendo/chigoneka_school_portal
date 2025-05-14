const { validationResult } = require("express-validator");
const { Parent } = require("../models"); // Adjust the path as per your project structure

// Create a new parent
const createParent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, name, surname, email, phone, address } = req.body;

  try {
    const newParent = await Parent.create({
      username,
      name,
      surname,
      email,
      phone,
      address,
    });
    res.status(201).json(newParent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all parents
const getParents = async (req, res) => {
  try {
    const parents = await Parent.findAll();
    res.status(200).json(parents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single parent by id
const getParentById = async (req, res) => {
  const { id } = req.params;

  try {
    const parent = await Parent.findByPk(id);
    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }
    res.status(200).json(parent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a parent
const updateParent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { username, name, surname, email, phone, address } = req.body;

  try {
    let parent = await Parent.findByPk(id);
    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }

    parent = await parent.update({
      username,
      name,
      surname,
      email,
      phone,
      address,
    });
    res.status(200).json(parent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a parent
const deleteParent = async (req, res) => {
  const { id } = req.params;

  try {
    const parent = await Parent.findByPk(id);
    if (!parent) {
      return res.status(404).json({ error: "Parent not found" });
    }

    await parent.destroy();
    res.status(204).json({ message: "Parent deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createParent,
  getParents,
  getParentById,
  updateParent,
  deleteParent,
};
