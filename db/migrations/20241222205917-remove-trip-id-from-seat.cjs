"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Seat", "tripId");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Seat", "tripId", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: "Trip",
        key: "id",
      },
    });
  },
};
