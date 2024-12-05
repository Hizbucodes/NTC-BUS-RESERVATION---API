const booking = require("../db/models/booking");
const route = require("../db/models/route");
const trip = require("../db/models/trip");
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

module.exports = { createBooking };
