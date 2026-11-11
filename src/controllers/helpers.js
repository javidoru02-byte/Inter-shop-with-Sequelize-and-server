const createError = require("http-errors");
const { Op } = require("sequelize");

const findOr404 = async (Model, id, options = {}) => {
  const instance = await Model.findByPk(id, options);
  if (!instance) throw createError(404, `${Model.name} with id=${id} not found`);
  return instance;
};

const findIdGreaterThan = async (Model, rawValue) => {
  let value = Number(rawValue);
  if (rawValue === undefined || rawValue === "") {
    value = Math.floor((await Model.count()) / 2);
  } else if (!Number.isInteger(value) || value < 0) {
    throw createError(400, "Query param 'value' must be a non-negative integer");
  }
  const data = await Model.findAll({
    where: { id: { [Op.gt]: value } },
    order: [["id", "ASC"]],
  });
  return { value, count: data.length, data };
};

module.exports = { findOr404, findIdGreaterThan };
