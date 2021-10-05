const User = require("../models/User");
const ErrorResponse = require("../utils/errorResponse");

exports.initsuperadmin = async (req, res, next) => {
  try {
    const userForChek = await User.findOne({
      username: process.env.SUPER_ADMIN_USERNAME,
    });
    if (userForChek) {
      return res
        .status(200)
        .json({ success: true, data: "Super admin already initialized" });
    }

    await User.create({
      username: process.env.SUPER_ADMIN_USERNAME,
      password: process.env.SUPER_ADMIN_PASSWORD,
    });

    res.status(200).json({ success: true, data: "Super admin initialized" });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(new ErrorResponse("Введите логин и пароль!", 400));
  }
  try {
    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return next(new ErrorResponse("Неправильный логин или пароль!", 404));
    }

    const isMatch = await user.matchPasswords(password);

    if (!isMatch) {
      return next(new ErrorResponse("Неправильный логин или пароль!", 404));
    }

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

exports.register = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.create({ username, password });
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.ifAuthorized = async (req, res, next) => {
  try {
    res.status(200).json({ success: true, msg: "Authorized" });
  } catch (error) {
    next(error);
  }
};

const sendToken = (user, statuscode, res) => {
  const token = user.getSignedToken();
  res.status(statuscode).json({ success: true, token });
};
