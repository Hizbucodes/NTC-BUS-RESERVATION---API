const user = require("../db/models/user");
const jwt = require("jsonwebtoken");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = async (req, res, next) => {
  const body = req.body;

  if (!["commuter", "operator"].includes(body.role)) {
    return res.status(400).json({
      status: "Fail",
      message: "Invalid user Role",
    });
  }

  const newUser = await user.create({
    role: body.role,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({
    id: result.id,
    email: result.email,
    firstName: result.firstName,
    lastName: result.lastName,
  });

  if (!result) {
    return res.status(400).json({
      status: "Fail",
      message: "Failed to create the user",
    });
  }

  return res.status(201).json({
    status: "Success",
    data: result,
  });
};

module.exports = { signup };
