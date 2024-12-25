import { DataTypes } from "sequelize";
import sequelize from "../../config/database.js";
import bus from "./bus.js";
import route from "./route.js";

const Trip = sequelize.define(
  "Trip",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    departureTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: {
          msg: "departure time cannot be null",
        },
        notEmpty: {
          msg: "depature time cannot be empty",
        },
      },
    },
    arrivalTime: {
      type: DataTypes.TIME,
      allowNull: false,
      validate: {
        notNull: {
          msg: "arrival time cannot be null",
        },
        notEmpty: {
          msg: "arrival time cannot be empty",
        },
      },
    },
    tripDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "trip date cannot be null",
        },
        notEmpty: {
          msg: "trip date cannot be empty",
        },
        isDate: {
          msg: "provide only date type",
        },
      },
    },
    tripStatus: {
      type: DataTypes.ENUM("scheduled", "cancelled"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "status cannot be null",
        },
        notEmpty: {
          msg: "status cannot be empty",
        },
        isIn: {
          args: [["scheduled", "cancelled"]],
          msg: "status must be scheduled or cancelled",
        },
      },
    },
    busId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Bus",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    routeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Route",
        key: "id",
      },
      onDelete: "CASCADE",
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
    modelName: "Trip",
  }
);

route.hasMany(Trip, { foreignKey: "routeId" });
Trip.belongsTo(route, { foreignKey: "routeId", onDelete: "CASCADE" });

bus.hasMany(Trip, { foreignKey: "busId", onDelete: "CASCADE" });
Trip.belongsTo(bus, { foreignKey: "busId", onDelete: "CASCADE" });

export default Trip;
