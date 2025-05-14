const { validationResult } = require("express-validator");
const { Announcement } = require("../models"); // Adjust the path as per your project structure

// Create a new announcement
const createAnnouncement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { title, description, date, classId } = req.body;

  try {
    const newAnnouncement = await Announcement.create({
      title,
      description,
      date,
      classId,
    });
    res.status(201).json(newAnnouncement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get all announcements
const getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.findAll();
    res.status(200).json(announcements);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Get a single announcement by id
const getAnnouncementById = async (req, res) => {
  const { id } = req.params;

  try {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }
    res.status(200).json(announcement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Update an announcement
const updateAnnouncement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const { title, description, date, classId } = req.body;

  try {
    let announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    announcement = await announcement.update({
      title,
      description,
      date,
      classId,
    });
    res.status(200).json(announcement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Delete an announcement
const deleteAnnouncement = async (req, res) => {
  const { id } = req.params;

  try {
    const announcement = await Announcement.findByPk(id);
    if (!announcement) {
      return res.status(404).json({ error: "Announcement not found" });
    }

    await announcement.destroy();
    res.status(204).json({ message: "Announcement deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement,
};
