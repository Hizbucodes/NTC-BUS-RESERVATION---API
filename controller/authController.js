const signup = (req, res, next) => {
  return res.status(201).json({
    status: "success",
    message: "Signup route are working",
  });
};

module.exports = { signup };
