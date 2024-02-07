const jwt = require("jsonwebtoken");
const _ = require("lodash");

const authenticateUser = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ errors: "authentication failed" });
  }
  token = token.split(" ")[1];
  try {
    const tokenData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = _.pick(tokenData, ["id", "role"]);
    next();
  } catch (e) {
    res.status(401).json({ errors: "authentication failed" });
  }
};

const authorizeUser = (roles) => {
  return function (req, res, next) {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return res
        .status(403)
        .json({ errors: "you are not authorized to access" });
    }
  };
};

module.exports = { authenticateUser, authorizeUser };
