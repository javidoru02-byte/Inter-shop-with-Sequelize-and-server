"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "customers", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      status: {
        type: Sequelize.ENUM("new", "paid", "shipped", "delivered", "cancelled"),
        allowNull: false,
        defaultValue: "new",
      },
      order_date: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn("NOW") },
      created_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
      updated_at: { allowNull: false, type: Sequelize.DATE, defaultValue: Sequelize.fn("NOW") },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("orders");
    await queryInterface.sequelize.query("DROP TYPE IF EXISTS \"enum_orders_status\";");
  },
};
