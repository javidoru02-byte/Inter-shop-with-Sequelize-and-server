const createError = require("http-errors");
const { Op } = require("sequelize");
const { Order, OrderItem, Product, Customer, sequelize } = require("../db/models");
const { findOr404 } = require("./helpers");

const fullOrder = {
  include: [
    { model: Customer, as: "customer", attributes: ["id", "firstName", "lastName", "email"] },
    {
      model: Product,
      as: "products",
      attributes: ["id", "title"],
      through: { attributes: ["quantity", "price"] },
    },
  ],
};

module.exports.getAll = async (req, res) => {
  const { limit, offset } = req.validatedQuery;
  const data = await Order.findAll({ limit, offset, order: [["id", "ASC"]] });
  res.json({ data });
};

module.exports.getByStatuses = async (req, res) => {
  const { statuses } = req.validatedQuery;
  const data = await Order.findAll({
    where: { status: { [Op.in]: statuses } },
    order: [["id", "ASC"]],
  });
  res.json({ count: data.length, data });
};

module.exports.getById = async (req, res) => {
  res.json({ data: await findOr404(Order, req.params.id, fullOrder) });
};

module.exports.create = async (req, res) => {
  const { customerId, status, items } = req.body;
  await findOr404(Customer, customerId);

  const productIds = [...new Set(items.map((i) => i.productId))];
  if (productIds.length !== items.length) {
    throw createError(400, "Duplicate productId in items");
  }
  const products = await Product.findAll({ where: { id: { [Op.in]: productIds } } });
  if (products.length !== productIds.length) {
    throw createError(404, "Some products not found");
  }
  const priceById = Object.fromEntries(products.map((p) => [p.id, p.price]));

  const order = await sequelize.transaction(async (transaction) => {
    const created = await Order.create({ customerId, status }, { transaction });
    await OrderItem.bulkCreate(
      items.map(({ productId, quantity }) => ({
        orderId: created.id,
        productId,
        quantity,
        price: priceById[productId],
      })),
      { transaction, validate: true },
    );
    return created;
  });

  res.status(201).json({ data: await Order.findByPk(order.id, fullOrder) });
};

module.exports.update = async (req, res) => {
  const order = await findOr404(Order, req.params.id);
  res.json({ data: await order.update({ status: req.body.status }) });
};

module.exports.remove = async (req, res) => {
  const order = await findOr404(Order, req.params.id);
  await order.destroy();
  res.status(204).end();
};
