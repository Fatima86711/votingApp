const mongoose = require("mongoose");
const mongoURL = "mongodb://127.0.0.1:27017/user";

mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("Connected to Mongo Server");
  })
  .catch((err) => {
    console.log("Error connecting to Mongo Server:", err);
  });
const db = mongoose.connection;
// db.on("connected", () => {
//   console.log("Connected to Mongo Server");
// });
db.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});
db.on("error", (err) => {
  console.log("Error Connecting to Mongo Server", err);
});
module.exports = db;
