const Application = require("../models/application-model");
const Applicant = require("../models/applicant-model");
const Job = require("../models/job-model");
const Recruiter = require("../models/recruiter-model");
const { validationResult } = require("express-validator");
const applicationCltr = {};
const nodemailer = require("nodemailer");
require("dotenv").config();

applicationCltr.list = async (req, res) => {
  const { jobId } = req.params;
  try {
    const userId = req.user.id;
    const recruiter = await Recruiter.findOne({ creator: userId });
    if (!recruiter) {
      return res.status(400).json({ message: "Recruiter not found" });
    }
    const applications = await Application.find({
      job: jobId,
      recruiter: recruiter._id,
    })
      .populate({
        path: "applicant",
        select: ["contactNumber", "experience", "creator"],
        populate: {
          path: "creator",
          select: ["userName", "email"],
        },
      })
      .populate({
        path: "resume",
        select: ["title", "resume"],
      });
    res.json(applications);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

applicationCltr.create = async (req, res) => {
  const jobId = req.params.id;
  const resumeId = req.body.resume;
  try {
    const applicant = await Applicant.findOne({ creator: req.user.id });
    const job = await Job.findOne({ _id: jobId });
    await Job.findByIdAndUpdate(jobId, {
      $push: { appliedUsers: applicant._id },
    });
    const application = new Application();
    application.job = jobId;
    application.applicant = applicant._id;
    application.resume = resumeId;
    application.recruiter = job.creator;
    application.save();
    await Applicant.findByIdAndUpdate(applicant._id, {
      $push: { appliedJobs: jobId },
    });
    res.json(application);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

applicationCltr.show = async (req, res) => {
  try {
    let user;
    let applications;

    console.log(req.user.role);

    if (req.user.role === "applicant") {
      user = await Applicant.findOne({ creator: req.user.id });
      applications = await Application.find({
        applicant: user._id,
      }).populate("job", ["title", "skills", "location", "experience"]);
    } else if (req.user.role === "recruiter") {
      user = await Recruiter.findOne({ creator: req.user.id });
      console.log(user);
      applications = await Application.find({
        recruiter: user._id,
      }).populate("applicant", ["experience"]);
    } else {
      return res.status(403).json({ message: "Invalid-role" });
    }

    res.json(applications);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

applicationCltr.changeStatus = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id } = req.params;
  const body = req.body;
  try {
    const recruiter = await Recruiter.findOne({
      creator: req.user.id,
    }).populate("creator", ["email", "userName"]);
    const application = await Application.findOneAndUpdate(
      { _id: id, recruiter: recruiter._id },
      body,
      { new: true }
    ).populate({
      path: "applicant",
      select: ["contactNumber", "experience", "creator"],
      populate: {
        path: "creator",
        select: ["userName", "email"],
      },
    });

    if (req.body.status === "shortlisted") {
      const findJobRole = await Job.findById(application.job);

      const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const message = {
        from: recruiter.creator.email,
        to: application.applicant.creator.email,
        subject: "Application_Status",
        text:
          `Hi ${application.applicant.creator.userName},\n\n` +
          `You have been shortlisted for the position of ${findJobRole.title}.\n\n` +
          `Thanks,\n${recruiter.creator.userName}`,
      };

      transporter.sendMail(message, (err, info) => {
        if (err) {
          console.log("Error while sending mail", err.message);
        } else {
          console.log("Email sent", info.messageId);
        }
      });
    }
    res.json(application);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

module.exports = applicationCltr;
