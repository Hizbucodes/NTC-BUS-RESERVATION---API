import booking from "../db/models/booking.js";
import Route from "../db/models/route.js";
import Trip from "../db/models/trip.js";
import Seat from "../db/models/seat.js";
import user from "../db/models/user.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Op } from "sequelize";
import bus from "../db/models/bus.js";

const BOOKING_TIMEOUT = 10 * 60 * 1000;

const reserveSeats = catchAsync(async (req, res, next) => {
  const { tripId, seatIds } = req.body;

  if (!Array.isArray(seatIds) || seatIds.length < 1 || seatIds.length > 4) {
    return next(new AppError("Please select between 1 to 4 seats", 400));
  }

  const transaction = await Seat.sequelize.transaction();

  try {
    const seats = await Seat.findAll({
      where: {
        id: seatIds,
        seatStatus: "Available",
      },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (seats.length !== seatIds.length) {
      await transaction.rollback();
      return next(
        new AppError("One or more selected seats are not available", 400)
      );
    }

    await Seat.update(
      {
        seatStatus: "Processing",
        processingExpiry: new Date(Date.now() + BOOKING_TIMEOUT),
      },
      {
        where: { id: seatIds },
        transaction,
      }
    );

    await transaction.commit();

    const tripDetails = await Trip.findByPk(tripId, {
      include: { model: Route },
    });

    const farePerKm = 6.1;
    const totalFare = tripDetails.Route.distance * farePerKm * seatIds.length;

    res.status(200).json({
      status: "success",
      message: "Seats reserved successfully",
      data: {
        tripId,
        seatIds,
        totalFare,
        expiresAt: new Date(Date.now() + BOOKING_TIMEOUT),
        timeoutIn: BOOKING_TIMEOUT,
      },
    });

    setTimeout(async () => {
      await Seat.update(
        { seatStatus: "Available" },
        {
          where: {
            id: seatIds,
            seatStatus: "Processing",
          },
        }
      );
    }, BOOKING_TIMEOUT);
  } catch (error) {
    await transaction.rollback();
    return next(new AppError("Failed to reserve seats", 500));
  }
});

const completeBooking = catchAsync(async (req, res, next) => {
  const {
    tripId,
    seatIds,
    commuterName,
    commuterAddress,
    commuterNIC,
    commuterPhoneNumber,
    commuterEmail,
  } = req.body;

  const userId = req.user.id;

  const reservedSeats = await Seat.findAll({
    where: {
      id: seatIds,
      seatStatus: "Processing",
      processingExpiry: {
        [Op.gt]: new Date(),
      },
    },
  });

  if (reservedSeats.length !== seatIds.length) {
    return next(
      new AppError(
        "Seat reservation has expired. Please select seats again.",
        400
      )
    );
  }

  if (
    !commuterName ||
    !commuterAddress ||
    !commuterNIC ||
    !commuterPhoneNumber ||
    !commuterEmail
  ) {
    return next(new AppError("Please fill in all required fields", 400));
  }

  const tripDetails = await Trip.findByPk(tripId, {
    include: { model: Route },
  });

  const farePerKm = 6.1;
  const totalFare = tripDetails.Route.distance * farePerKm * seatIds.length;

  const transaction = await booking.sequelize.transaction();

  try {
    const bookings = [];
    for (const seatId of seatIds) {
      const newBooking = await booking.create(
        {
          userId,
          tripId,
          seatId,
          totalFare: totalFare / seatIds.length,
          commuterName,
          commuterAddress,
          commuterNIC,
          commuterPhoneNumber,
          commuterEmail,
          paymentStatus: "paid",
        },
        { transaction }
      );

      bookings.push(newBooking);
    }

    await Seat.update(
      { seatStatus: "Booked" },
      {
        where: { id: seatIds },
        transaction,
      }
    );

    await transaction.commit();

    res.status(201).json({
      status: "success",
      message: "Booking completed successfully",
      data: {
        bookingId: bookings[0].id,
        tripId,
        seatNumbers: reservedSeats.map((seat) => seat.seatNumber),
        totalFare,
        commuterName,
        commuterEmail,
        commuterPhoneNumber,
      },
    });
  } catch (error) {
    await transaction.rollback();

    await Seat.update({ seatStatus: "Available" }, { where: { id: seatIds } });

    return next(new AppError("Failed to complete booking", 500));
  }
});

const cleanupExpiredReservations = async () => {
  try {
    await Seat.update(
      { seatStatus: "Available" },
      {
        where: {
          seatStatus: "Processing",
          processingExpiry: {
            [Op.lt]: new Date(),
          },
        },
      }
    );
  } catch (error) {
    console.error("Error cleaning up expired reservations:", error);
  }
};

setInterval(cleanupExpiredReservations, 60 * 1000);

const getAllBooking = catchAsync(async (req, res, next) => {
  try {
    const result = await booking.findAll({
      where: {
        paymentStatus: "paid",
      },
      include: [
        {
          model: user,
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: Trip,
          include: [
            {
              model: Route,
              attributes: ["origin", "destination"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!result.length) {
      return res.status(200).json({
        status: "success",
        message: "No bookings have been made by commuters yet",
      });
    }

    res.status(200).json({
      status: "success",
      results: result.length,
      data: result,
    });
  } catch (err) {
    return next(
      new AppError(`Error while getting booking details: ${err.message}`, 500)
    );
  }
});

const getAllBookingMadeByCommuter = catchAsync(async (req, res, next) => {
  try {
    const result = await booking.findAll({
      where: {
        paymentStatus: "paid",
      },
      include: [
        {
          model: user,
          attributes: ["firstName", "lastName", "email"],
        },
        {
          model: Trip,
          include: [
            {
              model: bus,
              attributes: ["id", "operatorName"],
            },
            {
              model: Route,
              attributes: ["origin", "destination"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!result.length) {
      return res.status(200).json({
        status: "success",
        message: "No bookings have been made by commuters yet",
      });
    }

    res.status(200).json({
      status: "success",
      results: result.length,
      data: result,
    });
  } catch (err) {
    return next(
      new AppError(`Error while getting booking details: ${err.message}`, 500)
    );
  }
});

const cancelBooking = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const existingBooking = await booking.findByPk(id, {
    include: { model: Seat },
  });

  if (!existingBooking) {
    return next(new AppError("Booking not found", 404));
  }

  if (existingBooking.paymentStatus === "cancelled") {
    return next(new AppError("The seat has already been cancelled", 400));
  }

  const bookingTimestamp = existingBooking.createdAt;

  const timeDifference = new Date() - new Date(bookingTimestamp);

  if (timeDifference <= 5 * 60 * 1000) {
    existingBooking.paymentStatus = "cancelled";
    await existingBooking.save();

    await Seat.update(
      { seatStatus: "Available" },
      { where: { id: existingBooking.seatId } }
    );

    return res.status(200).json({
      status: "success",
      message: "Booking cancelled successfully",
    });
  } else {
    return next(
      new AppError(
        "Cancellation period has expired. Cannot cancel booking.",
        400
      )
    );
  }
});

const resetSeatStatus = catchAsync(async (req, res, next) => {
  const { seatIds } = req.body;

  if (!Array.isArray(seatIds) || seatIds.length < 1) {
    return next(new AppError("Please provide valid seat IDs", 400));
  }

  try {
    const result = await Seat.update(
      { seatStatus: "Available" },
      {
        where: {
          id: seatIds,
          seatStatus: "Processing",
        },
      }
    );

    if (result[0] === 0) {
      return next(
        new AppError(
          "No seats found in 'Processing' status for the provided IDs",
          404
        )
      );
    }

    res.status(200).json({
      status: "success",
      message: "Seat status reset to 'Available' successfully",
    });
  } catch (err) {
    return next(
      new AppError(`Failed to reset seat status: ${err.message}`, 500)
    );
  }
});

export {
  reserveSeats,
  completeBooking,
  getAllBooking,
  cancelBooking,
  resetSeatStatus,
  getAllBookingMadeByCommuter,
};
