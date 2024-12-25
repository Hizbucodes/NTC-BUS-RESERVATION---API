"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Seat", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      busId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Bus",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      tripId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Trip",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      seatNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      seatStatus: {
        type: Sequelize.ENUM("Available", "Processing", "Booked"),
        defaultValue: "Available",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Seat");
  },
};
