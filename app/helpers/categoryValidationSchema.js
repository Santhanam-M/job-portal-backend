const Category = require("../models/category-model");

const categoryValidationSchema = {
  categoryName: {
    notEmpty: {
      errorMessage: "categoryName is required",
      bail: true,
    },
    custom: {
      options: async (value) => {
        const category = await Category.findOne({
          categoryName: { $regex: value, $options: "i" },
        });
        if (!category) {
          return true;
        } else {
          throw new Error(`Category name ${value} already exists`);
        }
      },
    },
  },
};

module.exports = categoryValidationSchema;
