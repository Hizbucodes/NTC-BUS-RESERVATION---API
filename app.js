require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const authRouter = require("./routes/authRoute");
const bus_route_Router = require("./routes/bus-routeRoute");
const catchAsync = require("./utils/catchAsync");
const AppError = require("./utils/appError");
const globalErrorHandler = require("./controller/errorController");

const app = express();

app.use(express.json());

// All routes will be here
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/route", bus_route_Router);

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
