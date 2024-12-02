module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("Bus", [
      {
        operatorName: "Trans Lanka",
        capacity: 50,
        licensePlate: "WP-1234",
        routeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        operatorName: "City Travels",
        capacity: 40,
        licensePlate: "WP-5678",
        routeId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        operatorName: "Fastline",
        capacity: 55,
        licensePlate: "EP-2233",
        routeId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        operatorName: "Express Way",
        capacity: 60,
        licensePlate: "SP-3344",
        routeId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        operatorName: "Quick Ride",
        capacity: 45,
        licensePlate: "WP-4455",
        routeId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Bus", null, {});
  },
};
