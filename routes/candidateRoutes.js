const express = require("express");
const router = express.Router();
const { jwtAuthMiddleware } = require("./../jwt");
const Candidate = require("./../candidate");
const User = require("../user");

const checkAdminRole = async (userId) => {
  try {
    const user = await User.findById(userId);
    return user.role === "admin";
  } catch (err) {
    return false;
  }
};

router.post("/", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user has not admin role." });
    }
    const data = req.body;
    const newCandidate = new Candidate(data);

    const response = await newCandidate.save();

    res.status(200).json({ response: response });
  } catch (err) {
    res.status(500).json({ err: "Internal Server Error" });
    console.log(err);
  }
});

router.put("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user has not admin role." });
    }
    const candidateId = req.params.candidateId;
    const updatedCandidateData = req.body;
    const response = await Candidate.findByIdAndUpdate(
      candidateId,
      updatedCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!response) {
      return res.status(404).json({ error: "Candidate Not Found" });
    }

    console.log("Updated data");
    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ err: "internal Server Error" });
  }
});

router.delete("/:candidateId", jwtAuthMiddleware, async (req, res) => {
  try {
    if (!(await checkAdminRole(req.user.id))) {
      return res.status(403).json({ message: "user has not admin role." });
    }
    const candidateId = req.params.candidateId;
    const response = await Candidate.findByIdAndDelete(candidateId);
    if (!response) {
      return res.status(404).json({ error: "Not Found" });
    }
    res.status(200).json({ message: "Deleted Successfully." });
  } catch (err) {
    res.status(500).json({ err: "internal Server Error" });
  }
});

router.post("/vote/:candidateId", jwtAuthMiddleware, async (req, res) => {
  const candidateId = req.params.candidateId;
  const userId = req.user.id;
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    if (user.isVoted) {
      return res.status(400).json({ message: "you have already voted" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "admin is not allowed" });
    }
    candidate.votes.push({ user: userId });
    candidate.voteCount++;
    await candidate.save();
    user.isVoted = true;
    await user.save();

    res.status(200).json({ message: "Vote cast successfully" });
  } catch (err) {
    return res.status(500).json({ err: "internal Server Error" });
  }
});

router.get("/vote/count", async (req, res) => {
  try {
    const candidates = await Candidate.find().sort({ voteCount: "desc" });
    // console.log(candidates);
    const voteRecord = candidates.map((data) => {
      return {
        party: data.party,
        count: data.voteCount,
      };
    });
    return res.status(200).json(voteRecord);
  } catch (err) {
    return res.status(500).json({ err: "internal Server Error" });
  }
});

module.exports = router;
