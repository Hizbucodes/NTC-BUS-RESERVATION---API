"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Booking", "commuterName", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("Booking", "commuterAddress", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("Booking", "commuterNIC", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("Booking", "commuterPhoneNumber", {
      type: Sequelize.STRING,
      allowNull: false,
    });
    await queryInterface.addColumn("Booking", "commuterEmail", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Booking", "commuterName");
    await queryInterface.removeColumn("Booking", "commuterAddress");
    await queryInterface.removeColumn("Booking", "commuterNIC");
    await queryInterface.removeColumn("Booking", "commuterPhoneNumber");
    await queryInterface.removeColumn("Booking", "commuterEmail");
  },
};
