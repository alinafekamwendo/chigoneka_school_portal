const { validationResult } = require("express-validator");
const { SubjectToTeacher } = require("../models"); // Adjust the path as per your project structure

// Create a new SubjectToTeacher entry
const createSubjectToTeacher = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { subjectId, teacherId } = req.body;

  try {
    const newSubjectToTeacher = await SubjectToTeacher.create({
      subjectId,
      teacherId,
    });
    res.status(201).json(newSubjectToTeacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all SubjectToTeacher entries
const getSubjectToTeachers = async (req, res) => {
  try {
    const subjectToTeachers = await SubjectToTeacher.findAll();
    res.status(200).json(subjectToTeachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single SubjectToTeacher entry by subjectId and teacherId
const getSubjectToTeacherById = async (req, res) => {
  const { subjectId, teacherId } = req.params;

  try {
    const subjectToTeacher = await SubjectToTeacher.findOne({
      where: { subjectId, teacherId },
    });
    if (!subjectToTeacher) {
      return res
        .status(404)
        .json({ error: "SubjectToTeacher entry not found" });
    }
    res.status(200).json(subjectToTeacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a SubjectToTeacher entry
const updateSubjectToTeacher = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { subjectId, teacherId } = req.params;
  const { newSubjectId, newTeacherId } = req.body;

  try {
    const subjectToTeacher = await SubjectToTeacher.findOne({
      where: { subjectId, teacherId },
    });
    if (!subjectToTeacher) {
      return res
        .status(404)
        .json({ error: "SubjectToTeacher entry not found" });
    }

    const updatedSubjectToTeacher = await subjectToTeacher.update({
      subjectId: newSubjectId,
      teacherId: newTeacherId,
    });
    res.status(200).json(updatedSubjectToTeacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a SubjectToTeacher entry
const deleteSubjectToTeacher = async (req, res) => {
  const { subjectId, teacherId } = req.params;

  try {
    const subjectToTeacher = await SubjectToTeacher.findOne({
      where: { subjectId, teacherId },
    });
    if (!subjectToTeacher) {
      return res
        .status(404)
        .json({ error: "SubjectToTeacher entry not found" });
    }

    await subjectToTeacher.destroy();
    res.status(204).json({ message: "SubjectToTeacher entry deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createSubjectToTeacher,
  getSubjectToTeachers,
  getSubjectToTeacherById,
  updateSubjectToTeacher,
  deleteSubjectToTeacher,
};
