const mongoose = require("mongoose");
require("dotenv").config();

const configureDB = async () => {
  const url = process.env.DB_URL

  try {
    await mongoose.connect(`${url}`);
    console.log("connect to db");
  } catch (e) {
    console.log("error connection to db", e.message);
  }
};

module.exports = configureDB;
