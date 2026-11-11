"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("addresses", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: { model: "customers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      country: { type: Sequelize.STRING(64), allowNull: false },
      city: { type: Sequelize.STRING(64), allowNull: false },
      street: { type: Sequelize.STRING(128), allowNull: false },
      zip: { type: Sequelize.STRING(16) },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("addresses");
  },
};
