const { Address, Customer } = require("../db/models");
const { findOr404 } = require("./helpers");

module.exports.getAll = async (req, res) => {
  const { limit, offset } = req.validatedQuery;
  const data = await Address.findAll({ limit, offset, order: [["id", "ASC"]] });
  res.json({ data });
};

module.exports.getById = async (req, res) => {
  const address = await findOr404(Address, req.params.id, {
    include: [{ model: Customer, as: "customer", attributes: ["id", "firstName", "lastName"] }],
  });
  res.json({ data: address });
};

module.exports.create = async (req, res) => {
  await findOr404(Customer, req.body.customerId);
  res.status(201).json({ data: await Address.create(req.body) });
};

module.exports.update = async (req, res) => {
  const address = await findOr404(Address, req.params.id);
  res.json({ data: await address.update(req.body) });
};

module.exports.remove = async (req, res) => {
  const address = await findOr404(Address, req.params.id);
  await address.destroy();
  res.status(204).end();
};
