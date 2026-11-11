"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Brand extends Model {
    static associate(models) {
      Brand.hasMany(models.Product, { foreignKey: "brandId", as: "products" });
    }
  }
  Brand.init(
    {
      title: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        validate: { notEmpty: true, len: [1, 64] },
      },
      country: { type: DataTypes.STRING(64) },
      description: { type: DataTypes.TEXT },
    },
    { sequelize, modelName: "Brand", tableName: "brands", underscored: true },
  );
  return Brand;
};
