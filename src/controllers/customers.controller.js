const createError = require("http-errors");
const { Op, fn, col, literal } = require("sequelize");
const { Customer, Address, Order, OrderItem, Product } = require("../db/models");
const { findOr404, findIdGreaterThan } = require("./helpers");

module.exports.getAll = async (req, res) => {
  const { limit, offset } = req.validatedQuery;
  const data = await Customer.findAll({ limit, offset, order: [["id", "ASC"]] });
  res.json({ data });
};

module.exports.getIdGreater = async (req, res) => {
  res.json(await findIdGreaterThan(Customer, req.query.value));
};

module.exports.getByLastNames = async (req, res) => {
  const { lastNames } = req.validatedQuery;
  const data = await Customer.findAll({ where: { lastName: { [Op.in]: lastNames } } });
  res.json({ data });
};

module.exports.getById = async (req, res) => {
  const customer = await findOr404(Customer, req.params.id, {
    include: [{ model: Address, as: "address" }],
  });
  res.json({ data: customer });
};

module.exports.create = async (req, res) => {
  const customer = await Customer.create(req.body);
  res.status(201).json({ data: customer });
};

module.exports.update = async (req, res) => {
  const customer = await findOr404(Customer, req.params.id);
  res.json({ data: await customer.update(req.body) });
};

module.exports.remove = async (req, res) => {
  const customer = await findOr404(Customer, req.params.id);
  await customer.destroy();
  res.status(204).end();
};

module.exports.removeByEmails = async (req, res) => {
  const emails = req.body.emails.map((e) => e.toLowerCase());
  const deleted = await Customer.destroy({ where: { email: { [Op.in]: emails } } });
  if (!deleted) throw createError(404, "No customers found for given emails");
  res.json({ deleted });
};

module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  const customer = await Customer.scope("withPassword").findOne({
    where: { email: email.toLowerCase() },
  });
  if (!customer || !(await customer.comparePassword(password))) {
    throw createError(401, "Invalid email or password");
  }
  res.json({ message: "Login successful", data: customer });
};

module.exports.getTopBuyer = async (req, res) => {
  const rows = await Customer.findAll({
    attributes: [
      "id",
      "firstName",
      "lastName",
      [fn("COUNT", fn("DISTINCT", col("orders.id"))), "ordersCount"],
      [fn("COALESCE", fn("SUM", col("orders->items.quantity")), 0), "itemsCount"],
    ],
    include: [
      {
        model: Order,
        as: "orders",
        attributes: [],
        required: true,
        include: [{ model: OrderItem, as: "items", attributes: [] }],
      },
    ],
    group: ["Customer.id"],
    order: [
      [literal('"ordersCount"'), "DESC"],
      [literal('"itemsCount"'), "DESC"],
    ],
    raw: true,
    subQuery: false,
  });
  if (!rows.length) throw createError(404, "No purchases yet");

  const max = Number(rows[0].ordersCount);
  const data = rows
    .filter((r) => Number(r.ordersCount) === max)
    .map((r) => ({
      ...r,
      fullName: `${r.firstName} ${r.lastName}`,
      ordersCount: Number(r.ordersCount),
      itemsCount: Number(r.itemsCount),
    }));
  res.json({ data });
};

module.exports.getMostExpensiveBuyer = async (req, res) => {
  const maxPurchasedPrice = literal(
    "(SELECT MAX(p.price) FROM products p JOIN order_items oi ON oi.product_id = p.id)",
  );
  const data = await Customer.findAll({
    attributes: ["id", "firstName", "lastName", "email"],
    include: [
      {
        model: Order,
        as: "orders",
        attributes: ["id", "orderDate", "status"],
        required: true,
        include: [
          {
            model: Product,
            as: "products",
            attributes: ["id", "title", "price"],
            required: true,
            where: { price: { [Op.eq]: maxPurchasedPrice } },
            through: { attributes: ["quantity", "price"] },
          },
        ],
      },
    ],
  });
  if (!data.length) throw createError(404, "No purchases yet");
  res.json({ data });
};
