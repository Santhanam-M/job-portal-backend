const jobValidationSchema = {
  title: {
    notEmpty: {
      errorMessage: "title is required",
    },
  },
  description: {
    notEmpty: {
      errorMessage: "description is required",
    },
    isLength: {
      options: { min: 10 },
      errorMessage: "description should be minimum 10 characters",
    },
  },
  skills: {
    isArray: {
      options: { min: 1 },
      errorMessage: "skills required atleast one value",
    },
  },
  salary: {
    notEmpty: {
      errorMessage: "salary is required",
    },
  },
  jobType: {
    notEmpty: {
      errorMessage: "jobType is required",
    },
  },
  location: {
    notEmpty: {
      errorMessage: "location is required",
    },
  },
  experience: {
    notEmpty: {
      errorMessage: "experience details is required",
    },
  },
  dateOfPosting: {
    isDate: {
      errorMessage: "dateOfPosting should be valid",
      format: "YYYY-MM-DD",
    },
    custom: {
      options: (value) => {
        const today = new Date();
        const year = today.getFullYear(),
          month = today.getMonth() + 1,
          date = today.getDate();
        if (new Date(value) < new Date(`${year}-${month}-${date}`)) {
          throw new Error("created date should not be less than today");
        } else {
          return true;
        }
      },
    },
  },
  deadline: {
    isDate: {
      errorMessage: "deadline should be valid type",
      format: "YYYY-MM-DD",
    },
    custom: {
      options: (value, { req }) => {
        if (new Date(value) < new Date(req.body.dateOfPosting)) {
          throw new Error("deadline should not be less than dateOfPosting");
        } else {
          return true;
        }
      },
    },
  },
  category: {
    isMongoId: {
      errorMessage: "should be valid id",
    },
  },
};

module.exports = jobValidationSchema;
