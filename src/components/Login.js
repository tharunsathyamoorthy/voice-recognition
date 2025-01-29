// Login.js
import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Perform login logic here
    navigate("/converter"); // Navigate to converter after login
  };

  return (
    <div className="page-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <label>Username:</label>
        <input type="text" required />
        <label>Password:</label>
        <input type="password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;
