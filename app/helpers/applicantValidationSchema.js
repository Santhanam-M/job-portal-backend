const Applicant = require("../models/applicant-model");

const applicantValidationSchema = {
  contactNumber: {
    notEmpty: {
      errorMessage: "contact number is required",
    },
    isMobilePhone: {
      options: ["en-IN"],
      errorMessage: "contact number should be valid",
    },
    custom: {
      options: async (value) => {
        const applicant = await Applicant.findOne({ contactNumber: value });
        if (!applicant) {
          return true;
        } else {
          throw new Error("contact number already exists");
        }
      },
    },
  },
  aboutMe: {
    notEmpty: {
      errorMessage: "aboutMe is required",
    },
  },
  experience: {
    notEmpty: {
      errorMessage: "experience is required",
    },
  },
  location: {
    notEmpty: {
      errorMessage: "location is required",
    },
  },
};

module.exports = applicantValidationSchema;
