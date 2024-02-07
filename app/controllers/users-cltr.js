const User = require("../models/user-model");
const _ = require("lodash");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const usersCltr = {};

usersCltr.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, [
    "userName",
    "email",
    "password",
    "confirmPassword",
    "role",
  ]);
  try {
    const user = new User(body);
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    user.confirmPassword = hashedPassword;
    await user.save();
    res.json({ message: "User registered successfully", user });
  } catch (e) {
    res.status(500).json(e.message);
  }
};

usersCltr.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, ["email", "password"]);
  try {
    const user = await User.findOne({ email: body.email });
    if (!user) {
      return res
        .status(404)
        .json({ errors: [{ msg: "invalid email/password" }] });
    }
    const verifyPassword = await bcrypt.compare(body.password, user.password);
    if (!verifyPassword) {
      return res
        .status(404)
        .json({ errors: [{ msg: "invalid email/password" }] });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );
    res.json({
      token: `Bearer ${token}`,
      userRole: user.role,
      message: "Logged in",
    });
  } catch (e) {
    res.status(500).json(e.message);
  }
};
module.exports = usersCltr;
