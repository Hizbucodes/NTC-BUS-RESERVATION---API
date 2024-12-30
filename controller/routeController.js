import bus from "../db/models/bus.js";
import route from "../db/models/route.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";

const createRoute = catchAsync(async (req, res, next) => {
  const { origin, destination, distance, duration } = req.body;

  if (!origin || !destination || !distance || !duration) {
    return next(
      new AppError(
        "Please provide all required fields: origin, destination, distance, duration",
        400
      )
    );
  }

  if (origin === destination) {
    return next(new AppError("Origin and destination cannot be the same", 400));
  }

  const existingRoute = await route.findOne({
    where: {
      origin: origin,
      destination: destination,
    },
  });

  if (existingRoute) {
    return next(new AppError("Route already exists", 400));
  }

  if (distance <= 0 || duration <= 0) {
    return next(
      new AppError("Distance and duration must be positive numbers", 400)
    );
  }

  const newRoute = await route.create({
    origin,
    destination,
    distance,
    duration,
  });

  return res.status(201).json({
    status: "success",
    data: newRoute,
  });
});

const getAllRoutes = catchAsync(async (req, res, next) => {
  const result = await route.findAll({
    include: [{ model: bus }],
  });

  if (!result || result.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "No routes were added",
    });
  }

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

const getRouteById = catchAsync(async (req, res, next) => {
  const routeId = req.params.id;
  const result = await route.findByPk(routeId);

  if (!result) {
    return next(new AppError("Invalid route id", 400));
  }

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

const updateRoute = catchAsync(async (req, res, next) => {
  const routeId = req.params.id;
  const body = req.body;

  const result = await route.findByPk(routeId);

  if (!result) {
    return next(new AppError("Invalid route id", 400));
  }

  result.origin = body.origin;
  result.destination = body.destination;
  result.distance = body.distance;
  result.duration = body.duration;

  const updatedResult = await result.save();

  return res.status(200).json({
    status: "success",
    data: updatedResult,
  });
});

const deleteRoute = catchAsync(async (req, res, next) => {
  const routeId = req.params.id;

  const result = await route.findByPk(routeId);

  if (!result) {
    return next(new AppError("Invalid route id", 400));
  }

  await result.destroy();

  return res.status(200).json({
    status: "success",
    message: "Route deleted successfully",
  });
});

export { createRoute, getAllRoutes, getRouteById, updateRoute, deleteRoute };
