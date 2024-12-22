const { DataTypes } = require("sequelize");
const sequelize = require("../../config/database");
const bus = require("./bus");
const route = require("./route");

const trip = sequelize.define(
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
    modelName: "Trip",
  }
);

route.hasMany(trip, { foreignKey: "routeId" });
trip.belongsTo(route, { foreignKey: "routeId" });

bus.hasMany(trip, { foreignKey: "busId" });
trip.belongsTo(bus, { foreignKey: "busId" });

module.exports = trip;
