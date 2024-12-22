const { DataTypes } = require("sequelize");
const sequelize = require("../db");
const Bus = require("./bus");
const Trip = require("./trip");

const Seat = sequelize.define(
  "Seat",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    busId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Bus",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    tripId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "Trip",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    seatNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Seat number cannot be null",
        },
        notEmpty: {
          msg: "Seat number cannot be empty",
        },
      },
    },
    seatStatus: {
      type: DataTypes.ENUM("Available", "Booked"),
      defaultValue: "Available",
      validate: {
        notNull: {
          msg: "Seat status cannot be null",
        },
        notEmpty: {
          msg: "Seat status cannot be empty",
        },
        isIn: {
          args: [["Available", "Booked"]],
          msg: "Seat status must be Available or Booked",
        },
      },
    },
  },
  {
    freezeTableName: true,
    modelName: "Seat",
  }
);

Bus.hasMany(Seat, { foreignKey: "busId", onDelete: "CASCADE" });
Seat.belongsTo(Bus, { foreignKey: "busId" });

Trip.hasMany(Seat, { foreignKey: "tripId", onDelete: "CASCADE" });
Seat.belongsTo(Trip, { foreignKey: "tripId" });

module.exports = Seat;
