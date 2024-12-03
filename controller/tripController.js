const { Op } = require("sequelize");
const trip = require("../db/models/trip");
const catchAsync = require("../utils/catchAsync");
const moment = require("moment");
const route = require("../db/models/route");
const bus = require("../db/models/bus");
const AppError = require("../utils/appError");

const createTrip = catchAsync(async (req, res, next) => {
  try {
    const { busId, routeId, tripDate, departureTime, arrivalTime } = req.body;

    const formattedDepartureTime = moment(departureTime, "HH:mm").format(
      "HH:mm:ss"
    );
    const formattedArrivalTime = moment(arrivalTime, "HH:mm").format(
      "HH:mm:ss"
    );

    const conflictingTrip = await trip.findOne({
      where: {
        busId,
        tripDate,
        [Op.or]: [
          { departureTime: { [Op.between]: [departureTime, arrivalTime] } },
          { arrivalTime: { [Op.between]: [departureTime, arrivalTime] } },
        ],
      },
    });

    if (conflictingTrip) {
      return res.status(400).json({
        message: "Bus is already scheduled for another trip during this time",
      });
    }

    const newTrip = await trip.create({
      busId,
      routeId,
      tripDate,
      departureTime: formattedDepartureTime,
      arrivalTime: formattedArrivalTime,
      status: "scheduled",
    });

    res
      .status(201)
      .json({ message: "Trip created successfully", trip: newTrip });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create trip", error: error.message });
  }
});

const searchTrips = catchAsync(async (req, res, next) => {
  try {
    const { origin, destination, tripDate } = req.query;

    // Find routes matching origin and destination
    const routes = await route.findAll({
      where: {
        origin,
        destination,
      },
    });

    if (!routes.length) {
      return res.status(404).json({
        message: "No routes found for the specified origin and destination",
      });
    }

    // Get all route IDs
    const routeIds = routes.map((route) => route.id);

    // Find trips matching the route IDs and trip date
    const trips = await trip.findAll({
      where: {
        id: routeIds,
        tripDate,
        status: "scheduled", // Only include scheduled trips
      },
      include: [
        {
          model: bus,
          attributes: ["operatorName", "licensePlate", "capacity"],
        }, // Include bus details
        {
          model: route,
          attributes: ["origin", "destination", "distance", "duration"],
        }, // Include route details
      ],
    });

    if (!trips.length) {
      return next(new AppError("No trips found for the specified date", 404));
    }

    res.status(200).json(trips);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to search trips", error: error.message });
  }
});

module.exports = { createTrip, searchTrips };
