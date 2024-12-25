import { Op } from "sequelize";
import trip from "../db/models/trip.js";
import moment from "moment";
import route from "../db/models/route.js";
import bus from "../db/models/bus.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const createTrip = catchAsync(async (req, res, next) => {
  try {
    const { busId, routeId, tripDate, tripStatus, departureTime, arrivalTime } =
      req.body;

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
      tripStatus,
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

    const routeIds = routes.map((route) => route.id);

    const trips = await trip.findAll({
      where: {
        routeId: routeIds,
        tripDate: {
          [Op.eq]: new Date(tripDate),
        },
        tripStatus: "scheduled",
      },
      include: [
        {
          model: bus,
          attributes: ["operatorName", "licensePlate", "capacity"],
        },
        {
          model: route,
          attributes: ["origin", "destination", "distance", "duration"],
        },
      ],
    });

    if (!trips.length) {
      return next(new AppError("No trips found for the specified date", 404));
    }

    res.status(200).json({
      status: "success",
      result: trips,
    });
  } catch (error) {
    return next(new AppError("Failed to search trips", 500));
  }
});

const updateTrip = catchAsync(async (req, res, next) => {
  const tripScheduledId = req.params.id;
  const body = req.body;

  const result = await trip.findByPk(tripScheduledId);

  if (!result) {
    return next(new AppError("Invalid trip id", 400));
  }

  result.busId = body.busId;
  result.routeId = body.routeId;
  result.tripDate = body.tripDate;
  result.departureTime = body.departureTime;
  result.arrivalTime = body.arrivalTime;

  const updatedTrip = await result.save();

  return res.status(200).json({
    status: "success",
    data: updatedTrip,
  });
});

const cancelTrip = catchAsync(async (req, res, next) => {
  const tripScheduledId = req.params.id;

  const result = await trip.findByPk(tripScheduledId);

  if (!result) {
    return next(new AppError("Invalid trip id", 400));
  }

  result.tripStatus = "cancelled";

  await result.save();

  return res.status(200).json({
    status: "success",
    message: "Trip Schedule cancelled successfully",
  });
});

export { createTrip, searchTrips, updateTrip, cancelTrip };
