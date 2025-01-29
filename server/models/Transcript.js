// server/models/Transcript.js
const mongoose = require("mongoose");

const TranscriptSchema = new mongoose.Schema({
  text: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transcript", TranscriptSchema);
