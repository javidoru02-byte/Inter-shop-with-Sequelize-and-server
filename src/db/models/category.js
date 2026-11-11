"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      Category.hasMany(models.Product, { foreignKey: "categoryId", as: "products" });
    }
  }
  Category.init(
    {
      title: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [1, 64] },
      },
      description: { type: DataTypes.TEXT },
    },
    { sequelize, modelName: "Category", tableName: "categories", underscored: true },
  );
  return Category;
};
