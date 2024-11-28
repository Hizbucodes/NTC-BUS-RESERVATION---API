require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");
const authRouter = require("./routes/authRoute");

const app = express();

app.use(express.json());

app.get("/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to NTC BUS RESERVATION API DEVELOPMENT COURSE WORK",
  });
});

// All routes will be here
app.use("/api/v1/auth", authRouter);

app.use("*", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    message: `This ${req.originalUrl} Route is not Found`,
  });
});

const PORT = process.env.API_PORT || 4000;

app.listen(PORT, () => {
  console.log("Server is running on port:: ", PORT);
});
