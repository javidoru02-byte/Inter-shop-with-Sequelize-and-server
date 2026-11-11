"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("products", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      title: { type: Sequelize.STRING(128), allowNull: false },
      model: { type: Sequelize.STRING(64) },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 },
      description: { type: Sequelize.TEXT },
      brand_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "brands", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "categories", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT",
      },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });
    await queryInterface.addConstraint("products", {
      fields: ["price"],
      type: "check",
      where: { price: { [Sequelize.Op.gte]: 0 } },
      name: "products_price_check",
    });
    await queryInterface.addConstraint("products", {
      fields: ["quantity"],
      type: "check",
      where: { quantity: { [Sequelize.Op.gte]: 0 } },
      name: "products_quantity_check",
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("products");
  },
};
