const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = sequelize.define(
  "Bus",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    operatorName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "operator name cannot be null",
        },
        notEmpty: {
          msg: "operator name cannot be empty",
        },
      },
    },
    capacity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "capacity cannot be null",
        },
        notEmpty: {
          msg: "capacity cannot be empty",
        },
      },
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "license plate cannot be null",
        },
        notEmpty: {
          msg: "license plate cannot be empty",
        },
      },
    },
    routeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Route",
        key: "id",
      },
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    freezeTableName: true,
    modelName: "Bus",
  }
);
