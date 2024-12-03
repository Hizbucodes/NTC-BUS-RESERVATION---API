"use strict";

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Trip", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      departureTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      arrivalTime: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      tripDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("scheduled", "canceled"),
        allowNull: false,
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
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Trip");
  },
};
