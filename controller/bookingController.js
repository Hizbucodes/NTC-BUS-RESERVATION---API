const booking = require("../db/models/booking");
const route = require("../db/models/route");
const trip = require("../db/models/trip");
const user = require("../db/models/user");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

const createBooking = catchAsync(async (req, res, next) => {
  try {
    const { tripId, seatNumber, paymentStatus } = req.body;
    const userId = req.user.id;

    // Fetch trip details
    const tripResult = await trip.findByPk(tripId, {
      include: {
        model: route,
      },
    });

    if (!tripResult) {
      return next(new AppError("Trip not found", 404));
    }

    const existingBooking = await booking.findOne({
      where: { tripId, seatNumber },
    });
    if (existingBooking) {
      return next(new AppError("Seat is already booked", 400));
    }
    const routeInstance = await route.findByPk(tripResult.routeId);
    const distance = routeInstance.distance;
    console.log("distance type: ", typeof distance);
    const farePerKm = 6.1;
    const total_fare = distance * farePerKm;
    console.log(total_fare);

    const newBooking = await booking.create({
      userId: userId,
      tripId: tripId,
      seatNumber: seatNumber,
      paymentStatus: paymentStatus,
      totalFare: total_fare,
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create booking", error: error.message });
  }
});

const getAllBooking = catchAsync(async (req, res, next) => {
  const result = await booking.findAll({
    include: [
      {
        model: user,
        attributes: ["firstName", "lastName", "email"],
      },
      {
        model: trip,
        attributes: ["departureTime", "arrivalTime", "tripDate"],
        include: {
          model: route,
          attributes: ["origin", "destination", "distance"],
        },
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  if (!result.length) {
    return next(new AppError("No bookings found", 404));
  }

  res.status(200).json({
    status: "success",
    results: result.length,
    data: result,
  });
});

module.exports = { createBooking, getAllBooking };
