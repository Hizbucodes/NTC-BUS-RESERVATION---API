"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Seat", "seatStatus");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Seat", "seatStatus", {
      type: Sequelize.ENUM("Available", "Booked"),
      allowNull: false,
      defaultValue: "Available",
    });
  },
};
