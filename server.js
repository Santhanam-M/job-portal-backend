require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const configureDB = require("./config/db");
const port = 3555;

//controllers
const usersCltr = require("./app/controllers/users-cltr");
const recruiterCltr = require("./app/controllers/recruiter-cltr");
const applicantCltr = require("./app/controllers/applicants-cltr");
const categoryCltr = require("./app/controllers/category-cltr");
const resumeCltr = require("./app/controllers/resume-cltr");
const jobCltr = require("./app/controllers/job-cltr");
const applicationCltr = require("./app/controllers/application-cltr");

//middlewares
const {
  authenticateUser,
  authorizeUser,
} = require("./app/middlewares/authenticateUser");

//helpers
const {
  userRegistrationSchema,
  userLoginSchema,
} = require("./app/helpers/userValidationSchema");
const recruiterValidationSchema = require("./app/helpers/recruiterValidationSchema");
const applicantValidationSchema = require("./app/helpers/applicantValidationSchema");
const categoryValidationSchema = require("./app/helpers/categoryValidationSchema");
const resumeValidationSchema = require("./app/helpers/resumeValidationSchema");
const jobValidationSchema = require("./app/helpers/jobValidationSchema");
const applicationValidationSchema = require("./app/helpers/applicationValidationSchema");
const { checkSchema } = require("express-validator");

const app = express();
app.use(express.json());
app.use(cors());
configureDB();

//routes
app.post(
  "/api/users/register",
  checkSchema(userRegistrationSchema),
  usersCltr.register
);
app.post("/api/users/login", checkSchema(userLoginSchema), usersCltr.login);

//recruiters
app.get("/api/recruiter/myProfile", authenticateUser, recruiterCltr.myProfile);
app.put(
  "/api/recruiter/edit-profile",
  authenticateUser,
  recruiterCltr.editProfile
);
app.post(
  "/api/recruiter/createProfile",
  authenticateUser,
  authorizeUser(["recruiter"]),
  checkSchema(recruiterValidationSchema),
  recruiterCltr.create
);

//applicants
app.get("/api/applicant/myProfile", authenticateUser, applicantCltr.myProfile);
app.put(
  "/api/applicant/edit-profile",
  authenticateUser,
  applicantCltr.editProfile
);
app.post(
  "/api/applicant/createProfile",
  authenticateUser,
  authorizeUser(["applicant"]),
  checkSchema(applicantValidationSchema),
  applicantCltr.create
);

//category
app.get("/api/categories", categoryCltr.list);
app.post(
  "/api/categories",
  authenticateUser,
  authorizeUser(["recruiter"]),
  checkSchema(categoryValidationSchema),
  categoryCltr.create
);

//resume
const upload = multer({ storage: multer.memoryStorage() });

app.post(
  "/api/addResume",
  authenticateUser,
  authorizeUser(["applicant"]),
  upload.single("file"),
  checkSchema(resumeValidationSchema),
  resumeCltr.add
);
app.get(
  "/api/viewMyResume",
  authenticateUser,
  authorizeUser(["applicant"]),
  resumeCltr.get
);
app.delete(
  "/api/removeResume/:id",
  authenticateUser,
  authorizeUser(["applicant"]),
  resumeCltr.remove
);

//jobs
app.get("/api/allJobs", jobCltr.allJobs);
app.get(
  "/api/myJobs",
  authenticateUser,
  authorizeUser(["recruiter"]),
  jobCltr.getMyJobs
);
app.post(
  "/api/createJobs",
  authenticateUser,
  authorizeUser(["recruiter"]),
  checkSchema(jobValidationSchema),
  jobCltr.create
);
app.get(
  "/api/myJobs/:id",
  authenticateUser,
  authorizeUser(["recruiter"]),
  jobCltr.show
);
app.put(
  "/api/edit-myJob/:id",
  authenticateUser,
  authorizeUser(["recruiter"]),
  jobCltr.editJob
);
app.delete(
  "/api/removeJobs/:id",
  authenticateUser,
  authorizeUser(["recruiter"]),
  jobCltr.remove
);

//application
app.get(
  "/api/myApplication",
  authenticateUser,
  authorizeUser(["applicant", "recruiter"]),
  applicationCltr.show
);
app.post(
  "/api/application/:id",
  authenticateUser,
  authorizeUser(["applicant"]),
  applicationCltr.create
);
app.put(
  "/api/updateStatus/:id",
  authenticateUser,
  authorizeUser(["recruiter"]),
  checkSchema(applicationValidationSchema),
  applicationCltr.changeStatus
);
app.get(
  "/api/recruiter/myApplication/:jobId",
  authenticateUser,
  authorizeUser(["recruiter"]),
  applicationCltr.list
);

app.listen(port, () => {
  console.log("connected to port", port);
});
