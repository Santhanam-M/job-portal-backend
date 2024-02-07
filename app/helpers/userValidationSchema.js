const User = require("../models/user-model");

const userNameSchema = {
  notEmpty: {
    errorMessage: "username is required",
  },
  isLength: {
    options: { min: 4 },
    errorMessage: "username should contain minimum 4 characters",
  },
};

const emailRegisterSchema = {
  notEmpty: {
    errorMessage: "email is required",
  },
  isEmail: {
    errorMessage: "email should be valid",
  },
  custom: {
    options: async (value) => {
      const user = await User.findOne({ email: value });
      if (user) {
        throw new Error("email already exists");
      } else {
        return true;
      }
    },
  },
};

const emailLoginSchema = {
  notEmpty: {
    errorMessage: "email is required",
  },
  isEmail: {
    errorMessage: "email should be valid",
  },
};

const registerPasswordSchema = {
  trim: true,
  notEmpty: {
    errorMessage: "password is required",
  },
  isStrongPassword: {
    options: { minLength: 8, minLowerCase: 1, minNumbers: 1, maxLength: 12 },
    errorMessage:
      "password between 8 to 12 characters must contain one lowerCase, upperCase and number",
  },
};

const loginPasswordSchema = {
  notEmpty: {
    errorMessage: "password is required",
  },
};

const confirmPasswordSchema = {
  notEmpty: {
    errorMessage: "confirmPassword is required",
  },
  custom: {
    options: (value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password must be same");
      } else {
        return true;
      }
    },
  },
};

const roleSchema = {
  notEmpty: {
    errorMessage: "role is required",
  },
};

const userRegistrationSchema = {
  userName: userNameSchema,
  email: emailRegisterSchema,
  password: registerPasswordSchema,
  confirmPassword: confirmPasswordSchema,
  role: roleSchema,
};

const userLoginSchema = {
  email: emailLoginSchema,
  password: loginPasswordSchema,
};

module.exports = { userRegistrationSchema, userLoginSchema };
