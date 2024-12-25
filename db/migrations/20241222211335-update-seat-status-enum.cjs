"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Seat", "seatStatus", {
      type: Sequelize.ENUM("Available", "Processing", "Booked"),
      allowNull: false,
      defaultValue: "Available",
    });
  },

  async down(queryInterface, Sequelize) {
    // Alter the column to use the new enum type
    await queryInterface.changeColumn("Seat", "seatStatus", {
      type: Sequelize.ENUM("Available", "Booked"),
      allowNull: false,
      defaultValue: "Available",
    });
  },
};
