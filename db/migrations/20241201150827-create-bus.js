"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bus", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      operatorName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      capacity: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      busType: {
        type: Sequelize.ENUM("Normal", "Semi-Luxury", "Luxury"),
        allowNull: false,
      },

      amenities: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      licensePlate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      routeId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Route",
          key: "id",
        },
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
    await queryInterface.dropTable("Bus");
  },
};
