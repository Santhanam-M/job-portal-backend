const { validationResult } = require("express-validator");
const Resume = require("../models/resume-model");
const Applicant = require("../models/applicant-model");
const { uploadFileToS3, deleteFileS3 } = require("../../aws/aws");

const resumeCltr = {};

resumeCltr.add = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const title = req.body.title;
  const file = req.file;

  try {
    const uploadResponse = await uploadFileToS3(file);
    const fileUrl = uploadResponse.Location;

    if (!fileUrl) {
      return res.status(500).json({ message: "Failed to upload file to S3" });
    }

    const resume = new Resume({ title, resume: fileUrl });

    const applicant = await Applicant.findOne({ creator: req.user.id });
    resume.creator = applicant._id;

    await resume.save();
    await Applicant.findOneAndUpdate(
      { _id: applicant._id },
      { $push: { resumesCreated: resume._id } }
    );
    res.json(resume);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

resumeCltr.remove = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const applicant = await Applicant.findOne({ creator: userId });

    const resume = await Resume.findOneAndDelete({
      _id: id,
      creator: applicant._id,
    });
    if (!resume) {
      return res
        .status(404)
        .json({ message: "Resume not found or unauthorised to delete it" });
    }

    // Extract the key from the resume URL
    const key = resume.resume.split("/").pop();

    // Delete the file from S3
    await deleteFileS3(key);

    await Applicant.findByIdAndUpdate(applicant._id, {
      $pull: { resumesCreated: resume._id },
    });
    res.json(resume);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

resumeCltr.get = async (req, res) => {
  const userId = req.user.id;
  try {
    const applicant = await Applicant.findOne({ creator: userId });
    const resumes = await Resume.find({ creator: applicant._id });
    res.json(resumes);
  } catch (e) {
    res.status(500).json(e.message);
  }
};

module.exports = resumeCltr;
