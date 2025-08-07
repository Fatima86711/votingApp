const express = require("express");
const app = express();
const db = require("./db");
const userRouter = require("./routes/userRoutes");
const candidateRouter = require("./routes/candidateRoutes");
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome to voting app.");
});

app.use("/user", userRouter);
app.use("/candidate", candidateRouter);
app.listen(8000, () => {
  console.log("I'm Listening...");
});
