const catchAsync = require("../utils/catchAsync");
const Bus = require("../db/models/bus");
const Seat = require("../db/models/seat");
const AppError = require("../utils/appError");

const createSeatsForBus = catchAsync(async (req, res, next) => {
  const { busId, capacity } = req.body;

  const bus = await Bus.findByPk(busId);

  if (!bus) {
    return next(new AppError("Bus not found", 404));
  }

  const seats = [];

  for (let i = 1; i <= capacity; i++) {
    seats.push({
      busId,
      seatNumber: i,
    });
  }

  const createdSeats = await Seat.bulkCreate(seats);

  res.status(201).json({
    status: "success",
    message: "Seats created successfully",
    data: createdSeats,
  });
});

module.exports = { createSeatsForBus };
