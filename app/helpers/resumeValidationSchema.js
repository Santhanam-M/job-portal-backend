const resumeValidationSchema = {
  title: {
    notEmpty: {
      errorMessage: "title is required",
    },
  },
  resume: {
    custom: {
      options: (value, { req }) => {
        if (!req.file) {
          throw new Error("please upload resume");
        } else {
          if (req.file.mimetype !== "application/pdf") {
            throw new Error("pdf format is required");
          } else {
            return true;
          }
        }
      },
    },
  },
};

module.exports = resumeValidationSchema;
