const sequelize = require("../../config/database");
const User = require("../models/user");
const Trip = require("../models/trip");
const Seat = require("../models/seat");
const { DataTypes } = require("sequelize");

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
        isDecimal: {
          msg: "total fare must be in decimal format",
        },
      },
    },
    bookingDate: {
      allowNull: false,
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
    commuterName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Commuter name cannot be null",
        },
        notEmpty: {
          msg: "Commuter name cannot be empty",
        },
      },
    },
    commuterAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Commuter address cannot be null",
        },
        notEmpty: {
          msg: "Commuter address cannot be empty",
        },
      },
    },
    commuterNIC: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Commuter nic cannot be null",
        },
        notEmpty: {
          msg: "Commuter nic cannot be empty",
        },
      },
    },
    commuterPhoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Commuter phone number cannot be null",
        },
        notEmpty: {
          msg: "Commuter phone number cannot be empty",
        },
      },
    },
    commuterEmail: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Commuter email cannot be null",
        },
        notEmpty: {
          msg: "Commuter email cannot be empty",
        },
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "User",
        key: "id",
      },
    },
    tripId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Trip",
        key: "id",
      },
    },
    seatId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Seat",
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

Seat.hasOne(booking, { foreignKey: "id" });
booking.belongsTo(Seat, { foreignKey: "id" });

module.exports = booking;
