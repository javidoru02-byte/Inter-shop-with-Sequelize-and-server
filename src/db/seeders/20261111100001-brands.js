"use strict";

const brands = [
  ["Samsung", "South Korea", "Consumer electronics and smartphones"],
  ["Apple", "USA", "Premium smartphones, laptops and tablets"],
  ["Xiaomi", "China", "Affordable smartphones and smart home devices"],
  ["Dell", "USA", "Laptops, desktops and monitors"],
  ["Lenovo", "China", "Laptops and tablets"],
  ["HP", "USA", "Laptops, printers and peripherals"],
  ["Asus", "Taiwan", "Laptops, motherboards and monitors"],
  ["Sony", "Japan", "Audio, TV and gaming"],
  ["LG", "South Korea", "TVs, monitors and home appliances"],
  ["Logitech", "Switzerland", "Computer peripherals"],
  ["Acer", "Taiwan", "Laptops and monitors"],
  ["Huawei", "China", "Smartphones and wearables"],
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    await queryInterface.bulkInsert(
      "brands",
      brands.map(([title, country, description]) => ({
        title,
        country,
        description,
        created_at: now,
        updated_at: now,
      })),
    );
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query("TRUNCATE TABLE brands RESTART IDENTITY CASCADE;");
  },
};
