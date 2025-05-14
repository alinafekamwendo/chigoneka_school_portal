const { validationResult } = require("express-validator");
const { Lesson } = require("../models"); // Adjust the path as per your project structure

// Create a new lesson
const createLesson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { day, startTime, endTime, subjectId, classId, teacherId } = req.body;

  try {
    const newLesson = await Lesson.create({
      day,
      startTime,
      endTime,
      subjectId,
      classId,
      teacherId,
    });
    res.status(201).json(newLesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all lessons
const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.findAll();
    res.status(200).json(lessons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single lesson by id
const getLessonById = async (req, res) => {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }
    res.status(200).json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update a lesson
const updateLesson = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { day, startTime, endTime, subjectId, classId, teacherId } = req.body;

  try {
    let lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    lesson = await lesson.update({
      day,
      startTime,
      endTime,
      subjectId,
      classId,
      teacherId,
    });
    res.status(200).json(lesson);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete a lesson
const deleteLesson = async (req, res) => {
  const { id } = req.params;

  try {
    const lesson = await Lesson.findByPk(id);
    if (!lesson) {
      return res.status(404).json({ error: "Lesson not found" });
    }

    await lesson.destroy();
    res.status(204).json({ message: "Lesson deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createLesson,
  getLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
};
