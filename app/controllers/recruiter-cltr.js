const Recruiter = require("../models/recruiter-model");
const { validationResult } = require("express-validator");
const _ = require("lodash");

const recruiterCltr = {};

recruiterCltr.myProfile = async (req, res) => {
  const id = req.user.id;
  try {
    const user = await Recruiter.findOne({ creator: id }).populate("creator", [
      "_id",
      "userName",
      "email",
      "role",
    ]);
    if (!user) {
      return res.status(404).json({ errors: "no user found" });
    }
    res.json(user);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

recruiterCltr.editProfile = async (req, res) => {
  const body = req.body;
  const userId = req.user.id;
  try {
    const recruiter = await Recruiter.findOneAndUpdate(
      { creator: userId },
      body,
      { new: true, runValidators: true }
    );
    res.json(recruiter);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

recruiterCltr.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, [
    "companyName",
    "companyBio",
    "contactNumber",
    "createdJobs",
  ]);
  const recruiter = new Recruiter(body);
  recruiter.creator = req.user.id;
  try {
    const existingRecruiter = await Recruiter.findOne({ creator: req.user.id });
    if (existingRecruiter) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Profile already created" }] });
    }
    await recruiter.save();
    res.json({ message: "profile created successfully", recruiter });
  } catch (e) {
    res.status(500).json(e.message);
  }
};

module.exports = recruiterCltr;
