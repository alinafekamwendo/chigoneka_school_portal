const { SchoolYear } = require("../models");
const Joi = require("joi");
const { sequelize } = require("../models");

const createSchema = Joi.object({
  name: Joi.string().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
});

const createAcademicYear = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, startDate, endDate } = req.body;

    // Check for overlapping academic years
    const existingYear = await SchoolYear.findOne({
      where: {
        [Op.or]: [
          { startDate: { [Op.between]: [startDate, endDate] } },
          { endDate: { [Op.between]: [startDate, endDate] } },
        ],
      },
      transaction,
    });

    if (existingYear) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "Academic year overlaps with existing records" });
    }

    const academicYear = await SchoolYear.create(
      {
        name,
        startDate,
        endDate,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json(academicYear);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

const getAcademicYears = async (req, res) => {
  try {
    const years = await SchoolYear.findAll({
      order: [["startDate", "DESC"]],
    });
    res.json(years);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch academic years" });
  }
};

module.exports = { createAcademicYear, getAcademicYears };
