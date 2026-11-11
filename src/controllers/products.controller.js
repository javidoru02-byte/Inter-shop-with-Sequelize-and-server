const createError = require("http-errors");
const { Op } = require("sequelize");
const { Product, Brand, Category, sequelize } = require("../db/models");
const { findOr404, findIdGreaterThan } = require("./helpers");

module.exports.getAll = async (req, res) => {
  const { limit, offset } = req.validatedQuery;
  const data = await Product.findAll({ limit, offset, order: [["id", "ASC"]] });
  res.json({ data });
};

module.exports.getIdGreater = async (req, res) => {
  res.json(await findIdGreaterThan(Product, req.query.value));
};

module.exports.getByBrands = async (req, res) => {
  const { brandIds } = req.validatedQuery;
  const data = await Product.findAll({
    where: { brandId: { [Op.in]: brandIds } },
    order: [["brandId", "ASC"], ["id", "ASC"]],
  });
  res.json({ count: data.length, data });
};

module.exports.getById = async (req, res) => {
  const product = await findOr404(Product, req.params.id, {
    include: [
      { model: Brand, as: "brand", attributes: ["id", "title"] },
      { model: Category, as: "category", attributes: ["id", "title"] },
    ],
  });
  res.json({ data: product });
};

module.exports.create = async (req, res) => {
  res.status(201).json({ data: await Product.create(req.body) });
};

module.exports.update = async (req, res) => {
  const product = await findOr404(Product, req.params.id);
  res.json({ data: await product.update(req.body) });
};

module.exports.changePrice = async (req, res) => {
  const { brandIds, percent } = req.body;
  const factor = 1 + percent / 100;
  const [updated, data] = await Product.update(
    { price: sequelize.literal(`ROUND(price * ${factor}, 2)`) },
    { where: { brandId: { [Op.in]: brandIds } }, returning: true },
  );
  if (!updated) throw createError(404, "No products found for given brands");
  res.json({ updated, data });
};

module.exports.remove = async (req, res) => {
  const product = await findOr404(Product, req.params.id);
  await product.destroy();
  res.status(204).end();
};

module.exports.removeByIds = async (req, res) => {
  const { ids } = req.body;
  const deleted = await Product.destroy({ where: { id: { [Op.in]: ids } } });
  if (!deleted) throw createError(404, "No products found for given ids");
  res.json({ deleted });
};
