const route = require("../db/models/route");
const catchAsync = require("../utils/catchAsync");

const createRoute = catchAsync(async (req, res, next) => {
  const body = req.body;

  const newRoute = await route.create({
    origin: body.origin,
    destination: body.destination,
    distance: body.distance,
    duration: body.duration,
  });

  return res.status(201).json({
    status: "success",
    data: newRoute,
  });
});

const getAllRoutes = catchAsync(async (req, res, next) => {
  const result = await route.findAll();

  // if(!result || result.length === 0){
  //     return res.status(404).json({
  //         status: 'err'
  //     })
  // }

  return res.status(200).json({
    status: "success",
    data: result,
  });
});

module.exports = { createRoute, getAllRoutes };
