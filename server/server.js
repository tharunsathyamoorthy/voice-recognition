require("dotenv").config(); // Load environment variables from .env
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000; // Server port

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON data

// MongoDB connection URI
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/mydatabase";

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1); // Exit if unable to connect to DB
  });

// Define Schema and Model for Transcript
const TranscriptSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ["voice", "text"], required: true }, // 'voice' or 'text'
  timestamp: { type: Date, default: Date.now },
});

const Transcript = mongoose.model("Transcript", TranscriptSchema);

// Nodemailer setup with port 587 for TLS
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use other services like SendGrid if needed
  auth: {
    user: process.env.EMAIL_USER, // Email from .env
    pass: process.env.EMAIL_PASSWORD, // App-specific password from .env
  },
  tls: {
    rejectUnauthorized: false, // Allows self-signed certificates (useful for some network configurations)
  },
  port: 587, // Use port 587 for sending email (TLS)
});

// API endpoint to send an email alert when a user signs up or logs in
app.post("/send-alert", async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_USER, // Send to yourself
    subject: "New Signup Alert",
    text: `A new user has signed up: ${username}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({ error: "Failed to send email", details: error.message });
  }
});

// API endpoint to save transcript data
app.post("/api/save-transcript", async (req, res) => {
  const { text, type } = req.body;

  if (!text || !type) {
    return res.status(400).json({ message: "Text and type are required." });
  }

  try {
    const newTranscript = new Transcript({ text, type });
    await newTranscript.save();
    res.status(201).json({ message: "Transcript saved successfully" });
  } catch (error) {
    console.error("Error saving transcript:", error.message);
    res.status(500).json({ message: "Error saving transcript", error: error.message });
  }
});

// API endpoint to get all transcripts 
app.get("/api/get-transcripts", async (req, res) => {
  try {
    const transcripts = await Transcript.find();
    res.status(200).json(transcripts);
  } catch (error) {
    console.error("Error retrieving transcripts:", error.message);
    res.status(500).json({ message: "Error retrieving transcripts", error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
