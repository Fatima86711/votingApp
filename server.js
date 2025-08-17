const express = require("express");
const app = express();
const userRouter = require("./routes/userRoutes");
const db = require("./db");
const candidateRouter = require("./routes/candidateRoutes");
const port = process.env.PORT || 8000;
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to voting app.");
});

app.use("/user", userRouter);
app.use("/candidate", candidateRouter);
// app.listen(port, () => {
//   console.log("I'm Listening...");
// });

module.exports = app;