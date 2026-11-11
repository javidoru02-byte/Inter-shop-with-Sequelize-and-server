"use strict";

const cities = ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro", "Vinnytsia", "Poltava"];
const streets = ["Khreshchatyk", "Shevchenka", "Franka", "Sumska", "Soborna", "Hrushevskoho"];

module.exports = {
  async up(queryInterface) {
    const [customers] = await queryInterface.sequelize.query("SELECT id FROM customers ORDER BY id;");
    const now = new Date();
    await queryInterface.bulkInsert(
      "addresses",
      customers.slice(0, -2).map(({ id }, i) => ({
        customer_id: id,
        country: "Ukraine",
        city: cities[i % cities.length],
        street: `${streets[i % streets.length]} St, ${10 + i}`,
        zip: String(1000 + i * 37).padStart(5, "0"),
        created_at: now,
        updated_at: now,
      })),
    );
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query("TRUNCATE TABLE addresses RESTART IDENTITY CASCADE;");
  },
};
