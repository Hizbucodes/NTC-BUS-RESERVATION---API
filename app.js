require("dotenv").config({ path: `${process.cwd()}/.env` });
const express = require("express");

const app = express();

app.get("/", (req, res, next) => {
  res.status(200).json({
    status: "success",
    message: "Welcome to NTC BUS RESERVATION API DEVELOPMENT COURSE WORK",
  });
});

const PORT = process.env.API_PORT;

app.listen(PORT, () => {
  console.log("Server is running on port:: ", PORT);
});
