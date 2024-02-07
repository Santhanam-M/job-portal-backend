const Recruiter = require("../models/recruiter-model");

const recruiterValidationSchema = {
  companyName: {
    notEmpty: {
      errorMessage: "company name is required",
    },
  },
  companyBio: {
    notEmpty: {
      errorMessage: "company bio is required",
    },
  },
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
        const recruiter = await Recruiter.findOne({ contactNumber: value });
        if (!recruiter) {
          return true;
        } else {
          throw new Error("contact number already exists");
        }
      },
    },
  },
};

module.exports = recruiterValidationSchema;
