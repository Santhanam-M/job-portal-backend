const { validationResult } = require("express-validator");
const Category = require("../models/category-model");
const _ = require("lodash");
const Recruiter = require("../models/recruiter-model");

const categoryCltr = {};

categoryCltr.list = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

categoryCltr.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, ["categoryName"]);
  const category = new Category(body);
  try {
    const recruiter = await Recruiter.findOne({ creator: req.user.id });
    category.creator = recruiter._id;
    await category.save();
    res.json(category);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

module.exports = categoryCltr;
