const { Op } = require("sequelize");
const trip = require("../db/models/trip");
const catchAsync = require("../utils/catchAsync");
const moment = require("moment");

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

module.exports = { createTrip };
