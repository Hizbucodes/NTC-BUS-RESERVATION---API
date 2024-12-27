import bus from "../db/models/bus.js";
import route from "../db/models/route.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const createBus = catchAsync(async (req, res, next) => {
  const body = req.body;

  const routeAlreadyExists = await route.findByPk(body.routeId);

  if (!routeAlreadyExists) {
    return res.status(404).json({
      status: "fail",
      message: "Route not found",
    });
  }

  const newBus = await bus.create({
    operatorName: body.operatorName,
    capacity: body.capacity,
    busType: body.busType,
    amenities: body.amenities,
    licensePlate: body.licensePlate,
    routeId: body.routeId,
  });

  return res.status(201).json({
    status: "success",
    data: newBus,
  });
});

const getAllBuses = catchAsync(async (req, res, next) => {
  const result = await bus.findAll();

  if (result.length === 0) {
    return next(new AppError("No content were added", 204));
  }

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

const updateBus = catchAsync(async (req, res, next) => {
  const busId = req.params.id;
  const body = req.body;

  const result = await bus.findByPk(busId);

  if (!result) {
    return next(new AppError("Invalid bus id", 400));
  }

  result.operatorName = body.operatorName;
  result.capacity = body.capacity;
  (result.busType = body.busType), (result.licensePlate = body.licensePlate);
  result.routeId = body.routeId;

  const updatedBusResult = await result.save();

  return res.status(200).json({
    status: "success",
    data: updatedBusResult,
  });
});

const deleteBus = catchAsync(async (req, res, next) => {
  const busId = req.params.id;

  const result = await bus.findByPk(busId);

  if (!result) {
    return next(new AppError("Invalid bus id", 400));
  }

  await result.destroy();

  return res.status(200).json({
    status: "success",
    message: "Bus deleted successfully",
  });
});

export { createBus, getAllBuses, updateBus, deleteBus };
