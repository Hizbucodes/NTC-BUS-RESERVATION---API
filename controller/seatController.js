const catchAsync = require("../utils/catchAsync");
const Bus = require("../db/models/bus");
const Seat = require("../db/models/seat");
const AppError = require("../utils/appError");

const createSeatsForBus = catchAsync(async (req, res, next) => {
  const { busId } = req.body;

  if (!busId) {
    return next(new AppError("Bus ID is required", 400));
  }

  const bus = await Bus.findByPk(busId);
  if (!bus) {
    return next(new AppError("Bus not found", 404));
  }

  const existingSeats = await Seat.count({ where: { busId } });
  if (existingSeats > 0) {
    return next(new AppError("Seats already exist for this bus", 400));
  }

  if (!bus.capacity || bus.capacity <= 0) {
    return next(new AppError("Invalid bus capacity", 400));
  }

  try {
    const seats = Array.from({ length: bus.capacity }, (_, index) => ({
      busId,
      seatNumber: index + 1,
      status: "available",
    }));

    const createdSeats = await Seat.bulkCreate(seats);

    res.status(201).json({
      status: "success",
      message: "Seats created successfully",
      data: {
        busId,
        totalSeats: createdSeats.length,
        seats: createdSeats,
      },
    });
  } catch (error) {
    return next(new AppError("Error creating seats: " + error.message, 500));
  }
});

const getSeatsByBus = catchAsync(async (req, res, next) => {
  const { busId } = req.params;

  const seats = await Seat.findAll({
    where: { busId },
    attributes: ["id", "seatNumber", "seatStatus"],
  });

  if (!seats.length) {
    return next(new AppError("No seats found for this bus", 404));
  }

  res.status(200).json({
    status: "success",
    results: seats.length,
    data: seats,
  });
});

module.exports = { createSeatsForBus, getSeatsByBus };
