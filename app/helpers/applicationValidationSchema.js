const applicationValidationSchema = {
  status: {
    notEmpty: {
      errorMessage: "status is required",
    },
  },
};

module.exports = applicationValidationSchema;
