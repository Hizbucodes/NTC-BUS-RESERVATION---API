"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Booking", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      seatNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      paymentStatus: {
        type: DataTypes.ENUM("paid", "pending", "cancelled"),
        allowNull: false,
      },
      totalFare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      bookingDate: {
        type: DataTypes.DATEONLY,
        defaultValue: DataTypes.NOW,
      },
      userId: {
        references: {
          model: "user",
          key: "id",
        },
      },
      tripId: {
        references: {
          model: "trip",
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Booking");
  },
};
