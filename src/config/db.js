const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed:");
    console.error(err);
    process.exit(1); // crash properly if DB fails
  }
}

module.exports = connectToDB;