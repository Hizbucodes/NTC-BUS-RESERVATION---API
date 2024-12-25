import dotenv from "dotenv";
dotenv.config({ path: `${process.cwd()}/.env` });

import express from "express";
import authRouter from "./routes/authRoute.js";

import bus_route_Router from "./routes/bus-routeRoute.js";
import busRoute from "./routes/busRoute.js";

import tripRoute from "./routes/tripRoute.js";
import bookingRoute from "./routes/bookingRoute.js";
import seatRoute from "./routes/seatRoute.js";

import catchAsync from "./utils/catchAsync.js";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./controller/errorController.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// All routes will be here
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/route", bus_route_Router);
app.use("/api/v1/buses", busRoute);
app.use("/api/v1/trips", tripRoute);
app.use("/api/v1/booking", bookingRoute);
app.use("/api/v1/seat", seatRoute);

app.use(
  "*",
  catchAsync(async (req, res, next) => {
    throw new AppError(`Can't find ${req.originalUrl} on this server`, 404);
  })
);

app.use(globalErrorHandler);

const PORT = process.env.API_PORT || 4000;

app.listen(PORT, () => {
  console.log("Server is running on port:: ", PORT);
});
