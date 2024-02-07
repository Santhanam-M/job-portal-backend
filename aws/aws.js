const aws = require("aws-sdk");
require("dotenv").config();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

function uploadFileToS3(file) {
  const uploadParams = {
    Bucket: "resumebuckets3",
    Key: Date.now().toString() + "_" + file.originalname,
    Body: file.buffer,
  };

  return new Promise((resolve, reject) => {
    s3.upload(uploadParams, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function deleteFileS3(key) {
  const deleteParams = {
    Bucket: "resumebuckets3",
    Key: key,
  };

  return new Promise((resolve, reject) => {
    s3.deleteObject(deleteParams, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

module.exports = { uploadFileToS3, deleteFileS3 };
