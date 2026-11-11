"use strict";
const { Model } = require("sequelize");

const STATUSES = ["new", "paid", "shipped", "delivered", "cancelled"];

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.Customer, { foreignKey: "customerId", as: "customer" });
      Order.belongsToMany(models.Product, {
        through: models.OrderItem,
        foreignKey: "orderId",
        otherKey: "productId",
        as: "products",
      });
      Order.hasMany(models.OrderItem, { foreignKey: "orderId", as: "items" });
    }
  }
  Order.STATUSES = STATUSES;
  Order.init(
    {
      customerId: { type: DataTypes.INTEGER, allowNull: false },
      status: {
        type: DataTypes.ENUM(...STATUSES),
        allowNull: false,
        defaultValue: "new",
        validate: { isIn: [STATUSES] },
      },
      orderDate: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
    },
    { sequelize, modelName: "Order", tableName: "orders", underscored: true },
  );
  return Order;
};
