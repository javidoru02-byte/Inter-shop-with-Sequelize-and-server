"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");

const SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

const hashPassword = async (customer) => {
  if (customer.changed("password")) {
    customer.password = await bcrypt.hash(customer.password, SALT_ROUNDS);
  }
};

module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    static associate(models) {
      Customer.hasOne(models.Address, { foreignKey: "customerId", as: "address" });
      Customer.hasMany(models.Order, { foreignKey: "customerId", as: "orders" });
    }

    comparePassword(plain) {
      return bcrypt.compare(plain, this.getDataValue("password"));
    }

    toJSON() {
      const values = { ...this.get() };
      delete values.password;
      return values;
    }
  }
  Customer.init(
    {
      firstName: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: { notEmpty: true },
      },
      lastName: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: { notEmpty: true },
      },
      email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        unique: { msg: "Email already in use" },
        validate: {
          notEmpty: { msg: "Email is required" },
          isEmail: { msg: "Email must be a valid email address" },
        },
        set(value) {
          this.setDataValue("email", typeof value === "string" ? value.trim().toLowerCase() : value);
        },
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: { len: { args: [6, 255], msg: "Password must be at least 6 characters" } },
      },
      phone: { type: DataTypes.STRING(20) },
    },
    {
      sequelize,
      modelName: "Customer",
      tableName: "customers",
      underscored: true,
      defaultScope: { attributes: { exclude: ["password"] } },
      scopes: { withPassword: { attributes: { include: ["password"] } } },
      hooks: {
        beforeCreate: hashPassword,
        beforeUpdate: hashPassword,
        beforeBulkCreate: (customers) => Promise.all(customers.map(hashPassword)),
      },
    },
  );
  return Customer;
};
