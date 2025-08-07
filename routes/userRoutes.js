const express = require("express");
const router = express.Router();
const User = require("./../user"); // Path to your user model
const { jwtAuthMiddleware, generateToken } = require("./../jwt");
const bcrypt = require("bcrypt");

router.post("/signup", async (req, res) => {
  console.log("Attempting to hit the signup route...");
  try {
    const data = req.body;
    const newUser = new User(data);
    const response = await newUser.save();
    const payload = {
      id: response.id,
    };
    const token = generateToken(payload);
    console.log(token);
    res.status(200).json({ response: response, token: token });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(409).json({ error: "CNIC already exists." });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { cnic, password } = req.body;
    const user = await User.findOne({ cnic: cnic }).select("password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const payload = {
      id: user.id,
    };
    const token = generateToken(payload);
    res.json({ token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

router.use(jwtAuthMiddleware);

router.get("/profile", async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

router.put("/profile/password", async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(userId).select("+password");

    if (!user || !(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

module.exports = router;
