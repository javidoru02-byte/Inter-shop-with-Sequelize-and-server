"use strict";

const rng = (seed) => () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};

const STATUSES = ["new", "paid", "shipped", "delivered", "cancelled"];

module.exports = {
  async up(queryInterface) {
    const random = rng(42);
    const [customers] = await queryInterface.sequelize.query("SELECT id FROM customers ORDER BY id;");
    const now = Date.now();
    const orders = [];

    customers.forEach(({ id }, i) => {
      const count = i === 2 ? 6 : 1 + Math.floor(random() * 3);
      for (let k = 0; k < count; k++) {
        const date = new Date(now - Math.floor(random() * 180) * 24 * 3600 * 1000);
        orders.push({
          customer_id: id,
          status: STATUSES[Math.floor(random() * STATUSES.length)],
          order_date: date,
          created_at: date,
          updated_at: date,
        });
      }
    });
    await queryInterface.bulkInsert("orders", orders);
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query("TRUNCATE TABLE orders RESTART IDENTITY CASCADE;");
  },
};
