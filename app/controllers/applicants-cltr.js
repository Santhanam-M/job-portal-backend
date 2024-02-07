const { validationResult } = require("express-validator");
const Applicant = require("../models/applicant-model");
const _ = require("lodash");
const applicantCltr = {};

applicantCltr.myProfile = async (req, res) => {
  const id = req.user.id;
  try {
    const applicant = await Applicant.findOne({ creator: id }).populate(
      "creator",
      ["_id", "userName", "email", "role"]
    );
    if (!applicant) {
      return res.status(404).json({ errors: "no user found" });
    }
    res.json(applicant);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

applicantCltr.editProfile = async (req, res) => {
  const body = req.body;
  const userId = req.user.id;
  try {
    const applicant = await Applicant.findOneAndUpdate(
      { creator: userId },
      body,
      { new: true }
    );
    res.json(applicant);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

applicantCltr.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, [
    "contactNumber",
    "experience",
    "aboutMe",
    "location",
  ]);
  const applicant = new Applicant(body);
  applicant.creator = req.user.id;
  try {
    const existingApplicant = await Applicant.findOne({ creator: req.user.id });
    if (existingApplicant) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Profile already created" }] });
    }
    await applicant.save();
    res.json({ message: "profile created sucessfully", applicant });
  } catch (e) {
    res.status(500).json(e.message);
  }
};

module.exports = applicantCltr;
