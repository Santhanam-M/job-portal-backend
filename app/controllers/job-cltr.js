const { validationResult } = require("express-validator");
const Job = require("../models/job-model");
const Recruiter = require("../models/recruiter-model");
const _ = require("lodash");

const jobCltr = {};

jobCltr.allJobs = async (req, res) => {
  try {
    const jobs = await Job.find().populate("creator", ["_id", "companyName"]);
    res.json(jobs);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

jobCltr.getMyJobs = async (req, res) => {
  const id = req.user.id;
  try {
    const recruiter = await Recruiter.findOne({ creator: id });
    const jobs = await Job.find({ creator: recruiter._id });
    res.json(jobs);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

jobCltr.editJob = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  try {
    const recruiter = await Recruiter.findOne({ creator: req.user.id });
    const job = await Job.findOneAndUpdate(
      { _id: id, creator: recruiter._id },
      body,
      { new: true }
    );
    if (!job) {
      return res.status(400).json({ message: "you are not authorized" });
    }
    res.json(job);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

jobCltr.show = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await Job.findOne({ _id: id }).populate({
      path: "appliedUsers",
      select: ["contactNumber", "experience", "creator"],
      populate: {
        path: "creator",
        select: ["userName", "email"],
      },
    });
    res.json(job);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

jobCltr.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const body = _.pick(req.body, [
    "title",
    "description",
    "skills",
    "salary",
    "jobType",
    "location",
    "experience",
    "dateOfPosting",
    "deadline",
    "category",
  ]);
  const job = new Job(body);
  try {
    const recruiter = await Recruiter.findOne({ creator: req.user.id });
    job.creator = recruiter._id;
    await job.save();
    await Recruiter.findOneAndUpdate(
      { creator: req.user.id },
      { $push: { createdJobs: job._id } }
    );
    res.json(job);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

jobCltr.remove = async (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;
  try {
    const recruiter = await Recruiter.findOne({ creator: userId });
    const removeJob = await Job.findOneAndDelete({
      _id: id,
      creator: recruiter._id,
    });
    if (!removeJob) {
      return res
        .status(404)
        .json({ message: "job not found or unauthorised to delete it" });
    }
    await Recruiter.findOneAndUpdate(
      { _id: recruiter._id },
      { $pull: { createdJobs: removeJob._id } }
    );
    res.json(removeJob);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

module.exports = jobCltr;
