require('dotenv').config();
const mongoose = require("mongoose");
// const mongoURI = "mongodb://127.0.0.1:27017/user";

const mongoURI =process.env.MONGODB_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ Connection error:", err));

const db = mongoose.connection;
db.on("connected", () => {
  console.log("Connected to Mongo Server");
});
db.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});
db.on("error", (err) => {
  console.log("Error Connecting to Mongo Server", err);
});
module.exports = db;
