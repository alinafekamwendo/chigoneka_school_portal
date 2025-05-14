const { Term, SchoolYear } = require("../models");
const Joi = require("joi");
const { sequelize } = require("../models");

const createSchema = Joi.object({
  tname: Joi.string().valid("FIRST", "SECOND", "THIRD").required(),
  schoolYearId: Joi.string().uuid().required(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref("startDate")).required(),
});

const createTerm = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { error } = createSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { tname, schoolYearId, startDate, endDate } = req.body;

    // Validate academic year exists
    const academicYear = await SchoolYear.findByPk(schoolYearId, {
      transaction,
    });
    if (!academicYear) {
      await transaction.rollback();
      return res.status(404).json({ error: "Academic year not found" });
    }

    // Check term dates within academic year
    if (
      new Date(startDate) < academicYear.startDate ||
      new Date(endDate) > academicYear.endDate
    ) {
      await transaction.rollback();
      return res
        .status(400)
        .json({ error: "Term dates must be within academic year" });
    }

    const term = await Term.create(
      {
        tname,
        schoolYearId,
        startDate,
        endDate,
      },
      { transaction }
    );

    await transaction.commit();
    res.status(201).json(term);
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ error: error.message });
  }
};

module.exports = { createTerm };
