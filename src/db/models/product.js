"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.belongsTo(models.Brand, { foreignKey: "brandId", as: "brand" });
      Product.belongsTo(models.Category, { foreignKey: "categoryId", as: "category" });
      Product.belongsToMany(models.Order, {
        through: models.OrderItem,
        foreignKey: "productId",
        otherKey: "orderId",
        as: "orders",
      });
      Product.hasMany(models.OrderItem, { foreignKey: "productId", as: "orderItems" });
    }
  }
  Product.init(
    {
      title: {
        type: DataTypes.STRING(128),
        allowNull: false,
        validate: { notEmpty: true },
      },
      model: { type: DataTypes.STRING(64) },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
        validate: { isDecimal: true, min: 0 },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { isInt: true, min: 0 },
      },
      description: { type: DataTypes.TEXT },
      brandId: { type: DataTypes.INTEGER, allowNull: false },
      categoryId: { type: DataTypes.INTEGER, allowNull: false },
    },
    { sequelize, modelName: "Product", tableName: "products", underscored: true },
  );
  return Product;
};
