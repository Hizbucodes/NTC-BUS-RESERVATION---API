const sequelize = require("../../config/database");
const User = require("../models/user");
const Trip = require("../models/trip");

const booking = sequelize.define(
  "Booking",
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    seatNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "seat number cannot be null",
        },
        notEmpty: {
          msg: "seat number cannot be empty",
        },
      },
    },
    paymentStatus: {
      type: DataTypes.ENUM("paid", "pending", "cancelled"),
      allowNull: false,
      validate: {
        notNull: {
          msg: "payment status cannot be null",
        },
        notEmpty: {
          msg: "payment status cannot be empty",
        },
        isIn: {
          args: [["paid", "pending", "cancelled"]],
          msg: "payment status must be paid, pending, cancelled",
        },
      },
    },
    totalFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        notNull: {
          msg: "total fare cannot be null",
        },
        notEmpty: {
          msg: "total fare cannot be empty",
        },
        isDecimal: {
          msg: "total fare mus be in decimal format",
        },
      },
    },
    bookingDate: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      validate: {
        notNull: {
          msg: "booking date cannot be null",
        },
        notEmpty: {
          msg: "booking date cannot be empty",
        },
        isDate: {
          msg: "booking date must be in date format",
        },
      },
    },
    userId: {
      references: {
        model: "User",
        key: "id",
      },
    },
    tripId: {
      references: {
        model: "Trip",
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
    modelName: "Booking",
  }
);

User.hasMany(booking, { foreignKey: "id" });
booking.belongsTo(User, { foreignKey: "id" });

Trip.hasMany(booking, { foreignKey: "id" });
booking.belongsTo(Trip, { foreignKey: "id" });

module.exports = booking;
