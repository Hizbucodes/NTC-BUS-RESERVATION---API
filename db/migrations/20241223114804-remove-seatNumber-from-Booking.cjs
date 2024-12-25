"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Booking", "seatNumber");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Booking", "seatNumber", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
