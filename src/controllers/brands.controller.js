const createError = require("http-errors");
const { Op } = require("sequelize");
const { Brand } = require("../db/models");
const { findOr404, findIdGreaterThan } = require("./helpers");

module.exports.getAll = async (req, res) => {
  const { limit, offset } = req.validatedQuery;
  const data = await Brand.findAll({ limit, offset, order: [["id", "ASC"]] });
  res.json({ data });
};

module.exports.getIdGreater = async (req, res) => {
  res.json(await findIdGreaterThan(Brand, req.query.value));
};

module.exports.getByTitles = async (req, res) => {
  const { titles } = req.validatedQuery;
  const data = await Brand.findAll({ where: { title: { [Op.in]: titles } } });
  res.json({ data });
};

module.exports.getById = async (req, res) => {
  res.json({ data: await findOr404(Brand, req.params.id) });
};

module.exports.create = async (req, res) => {
  const brand = await Brand.create(req.body);
  res.status(201).json({ data: brand });
};

module.exports.update = async (req, res) => {
  const brand = await findOr404(Brand, req.params.id);
  res.json({ data: await brand.update(req.body) });
};

module.exports.remove = async (req, res) => {
  const brand = await findOr404(Brand, req.params.id);
  await brand.destroy();
  res.status(204).end();
};

module.exports.removeByTitles = async (req, res) => {
  const { titles } = req.body;
  const deleted = await Brand.destroy({ where: { title: { [Op.in]: titles } } });
  if (!deleted) throw createError(404, "No brands found for given titles");
  res.json({ deleted });
};
