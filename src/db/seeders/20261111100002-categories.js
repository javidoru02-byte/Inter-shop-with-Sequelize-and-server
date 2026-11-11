"use strict";

const categories = [
  ["Smartphones", "Mobile phones"],
  ["Laptops", "Portable computers"],
  ["Tablets", "Tablet computers"],
  ["Monitors", "Computer displays"],
  ["Headphones", "Headphones and earbuds"],
  ["Accessories", "Mice, keyboards and other accessories"],
  ["TVs", "Televisions"],
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "categories",
      categories.map(([title, description]) => ({
        title,
        description,
        created_at: now,
        updated_at: now,
      })),
    );
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query("TRUNCATE TABLE categories RESTART IDENTITY CASCADE;");
  },
};
