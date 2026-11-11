"use strict";

const rng = (seed) => () => {
  seed = (seed * 1103515245 + 12345) % 2147483648;
  return seed / 2147483648;
};

module.exports = {
  async up(queryInterface) {
    const random = rng(7);
    const [orders] = await queryInterface.sequelize.query("SELECT id FROM orders ORDER BY id;");
    const [products] = await queryInterface.sequelize.query(
      "SELECT id, price FROM products ORDER BY id;",
    );
    const now = new Date();
    const items = [];

    orders.forEach(({ id: orderId }) => {
      const used = new Set();
      const count = 1 + Math.floor(random() * 4);
      while (used.size < count) {
        const product = products[Math.floor(random() * products.length)];
        if (used.has(product.id)) continue;
        used.add(product.id);
        items.push({
          order_id: orderId,
          product_id: product.id,
          quantity: 1 + Math.floor(random() * 3),
          price: product.price,
          created_at: now,
          updated_at: now,
        });
      }
    });
    await queryInterface.bulkInsert("order_items", items);
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query("TRUNCATE TABLE order_items RESTART IDENTITY CASCADE;");
  },
};
