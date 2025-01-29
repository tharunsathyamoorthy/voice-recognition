import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      // Perform signup logic here

      // Send alert email
      await fetch("http://localhost:5000/send-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      alert("Signup successful! Notification email sent.");
      navigate("/login");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <div className="page-container">
      <form onSubmit={handleSignup}>
        <h2>Signup</h2>
        <label>Username:</label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label>Password:</label>
        <input type="password" required />
        <button type="submit">Signup</button>
      </form>
    </div>
  );
}

export default Signup;
