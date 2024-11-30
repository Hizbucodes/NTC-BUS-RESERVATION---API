const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");

module.exports = sequelize.define(
  "Route",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "origin cannot be null",
        },
        notEmpty: {
          msg: "origin cannot be empty",
        },
      },
    },
    destination: {
      type: DataTypes.STRING,
      validate: {
        notNull: {
          msg: "destination cannot be null",
        },
        notEmpty: {
          msg: "destination cannot be empty",
        },
      },
    },
    distance: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: {
          msg: "distance cannot be null",
        },
        notEmpty: {
          msg: "distance cannot be empty",
        },
        isNumeric: {
          msg: "distance must be in number",
        },
      },
    },
    duration: {
      type: DataTypes.INTEGER,
      validate: {
        notNull: {
          msg: "duration cannot be null",
        },
        notEmpty: {
          msg: "duration cannot be empty",
        },
        isNumeric: {
          msg: "duration must be in number",
        },
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
    paranoid: true,
    freezeTableName: true,
    modelName: "Route",
  }
);
