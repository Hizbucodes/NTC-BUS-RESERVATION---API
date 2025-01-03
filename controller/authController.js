import user from "../db/models/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/appError.js";
import { Op } from "sequelize";

// function to generate the jsonwebtoken
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// function for user registration
const signup = catchAsync(async (req, res, next) => {
  const body = req.body;

  if (!["commuter", "operator", "admin"].includes(body.role)) {
    throw new AppError("Invalid user role", 400);
  }

  const newUser = await user.create({
    role: body.role,
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    password: body.password,
    confirmPassword: body.confirmPassword,
  });

  if (!newUser) {
    return next(new AppError("Failed to create the user", 400));
  }

  const result = newUser.toJSON();

  delete result.password;
  delete result.deletedAt;

  result.token = generateToken({
    id: result.id,
    email: result.email,
    firstName: result.firstName,
    lastName: result.lastName,
    role: result.role,
  });

  return res.status(201).json({
    status: "Success",
    data: result,
  });
});

// Funtion for user login
const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  const result = await user.findOne({
    where: { email },
  });

  if (!result || !(await bcrypt.compare(password, result.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  const token = generateToken({
    id: result.id,
    firstName: result.firstName,
    lastName: result.lastName,
    email: result.email,
    role: result.role,
  });

  return res.status(200).json({
    status: "Success",
    token: token,
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  const loggedInUser = req.user;

  const userToDelete = await user.findByPk(loggedInUser.id);

  if (!userToDelete) {
    return next(new AppError("User not found", 404));
  }

  await userToDelete.destroy();

  res.status(200).json({
    status: "success",
    message: "Your account has been deleted",
  });
});

const authentication = catchAsync(async (req, res, next) => {
  let idToken = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    idToken = req.headers.authorization.split(" ")[1];
  }

  if (!idToken) {
    return next(new AppError("Please login to get access", 401));
  }

  const tokenDetail = jwt.verify(idToken, process.env.JWT_SECRET_KEY);

  const freshUser = await user.findByPk(tokenDetail.id);

  if (!freshUser) {
    return next(new AppError("User no longer exists", 400));
  }

  req.user = freshUser;

  return next();
});

const verifyToken = catchAsync(async (req, res, next) => {
  let tokenIdentity = "";
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    tokenIdentity = req.headers.authorization.split(" ")[1];
  }

  if (!tokenIdentity) {
    return next(new AppError("Please login to get access", 401));
  }

  const decoded = jwt.verify(tokenIdentity, process.env.JWT_SECRET_KEY);

  const loggedInUser = await user.findByPk(decoded.id);

  if (!loggedInUser) {
    return next(new AppError("User not found", 404));
  }

  res.status(200).json({
    status: "Success",
    user: {
      id: loggedInUser.id,
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      email: loggedInUser.email,
      role: loggedInUser.role,
    },
  });
});

const restrictTo = (...userRole) => {
  const checkPermission = (req, res, next) => {
    if (!userRole.includes(req.user.role)) {
      return next(
        new AppError("You don't have permission to perform this action", 403)
      );
    }

    return next();
  };

  return checkPermission;
};

const getAllUsersWithOperatorRole = catchAsync(async (req, res, next) => {
  const operators = await user.findAll({
    where: {
      role: "operator",
    },
    attributes: ["id", "firstName", "lastName"],
  });

  if (!operators.length) {
    return res.status(404).json({
      status: "fail",
      message: "No operators found",
      operators: [],
    });
  }

  return res.status(200).json({
    status: "success",
    operators,
  });
});

export {
  signup,
  signin,
  getAllUsersWithOperatorRole,
  authentication,
  restrictTo,
  verifyToken,
  deleteUser,
};
