import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";

const Route = sequelize.define(
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
      allowNull: false,
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
      allowNull: false,
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
      allowNull: false,
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
    freezeTableName: true,
    modelName: "Route",
  }
);

export default Route;
