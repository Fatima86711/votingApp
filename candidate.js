const mongoose = require("mongoose");
// const passport = require("passport");
// const LocalString = require("passport-local");
const bcrypt = require("bcrypt");
// const { stringify } = require("querystring");
const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  party: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  votes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        req: "true",
      },
      votedAt: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
  voteCount: {
    type: Number,
    default: 0,
  },
});

const candidate = mongoose.model("candidate", CandidateSchema);
module.exports = candidate;
