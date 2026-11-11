const { Category } = require("../db/models");
const { findOr404 } = require("./helpers");

module.exports.getAll = async (req, res) => {
  const { limit, offset } = req.validatedQuery;
  const data = await Category.findAll({ limit, offset, order: [["id", "ASC"]] });
  res.json({ data });
};

module.exports.getById = async (req, res) => {
  res.json({ data: await findOr404(Category, req.params.id) });
};

module.exports.create = async (req, res) => {
  res.status(201).json({ data: await Category.create(req.body) });
};

module.exports.update = async (req, res) => {
  const category = await findOr404(Category, req.params.id);
  res.json({ data: await category.update(req.body) });
};

module.exports.remove = async (req, res) => {
  const category = await findOr404(Category, req.params.id);
  await category.destroy();
  res.status(204).end();
};
