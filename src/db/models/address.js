"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Address extends Model {
    static associate(models) {
      Address.belongsTo(models.Customer, { foreignKey: "customerId", as: "customer" });
    }
  }
  Address.init(
    {
      customerId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      country: { type: DataTypes.STRING(64), allowNull: false, validate: { notEmpty: true } },
      city: { type: DataTypes.STRING(64), allowNull: false, validate: { notEmpty: true } },
      street: { type: DataTypes.STRING(128), allowNull: false, validate: { notEmpty: true } },
      zip: { type: DataTypes.STRING(16) },
    },
    { sequelize, modelName: "Address", tableName: "addresses", underscored: true },
  );
  return Address;
};
