"use strict";
require("../../config/config");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

const customers = [
  ["Olena", "Kovalenko", "+380501112201"],
  ["Andrii", "Shevchenko", "+380501112202"],
  ["Iryna", "Bondarenko", "+380501112203"],
  ["Taras", "Melnyk", "+380501112204"],
  ["Oksana", "Tkachenko", "+380501112205"],
  ["Dmytro", "Kravchenko", "+380501112206"],
  ["Nataliia", "Oliinyk", "+380501112207"],
  ["Serhii", "Shevchuk", "+380501112208"],
  ["Yuliia", "Polishchuk", "+380501112209"],
  ["Oleksandr", "Lysenko", "+380501112210"],
  ["Mariia", "Boiko", "+380501112211"],
  ["Volodymyr", "Moroz", "+380501112212"],
  ["Kateryna", "Pavlenko", "+380501112213"],
  ["Bohdan", "Savchenko", "+380501112214"],
  ["Anna", "Rudenko", "+380501112215"],
  ["Maksym", "Marchenko", "+380501112216"],
  ["Sofiia", "Karpenko", "+380501112217"],
  ["Ivan", "Hrytsenko", "+380501112218"],
  ["Viktoriia", "Zinchenko", "+380501112219"],
  ["Roman", "Kuzmenko", "+380501112220"],
];

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const rows = await Promise.all(
      customers.map(async ([firstName, lastName, phone], i) => ({
        first_name: firstName,
        last_name: lastName,
        email: `${firstName}.${lastName}@example.com`.toLowerCase(),
        password: await bcrypt.hash(`Password${i + 1}!`, SALT_ROUNDS),
        phone,
        created_at: now,
        updated_at: now,
      })),
    );
    await queryInterface.bulkInsert("customers", rows);
  },
  async down(queryInterface) {
    await queryInterface.sequelize.query("TRUNCATE TABLE customers RESTART IDENTITY CASCADE;");
  },
};
