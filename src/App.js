import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';

// Import Signup, Login, and Converter pages
import Signup from "./components/Signup";
import Login from "./components/Login";
import Converter from "./components/Converter";

function App() {
  return (
    <Router>
      <nav>
        <Link to="/signup">Signup</Link> | <Link to="/login">Login</Link> | <Link to="/converter">Converter</Link>
      </nav>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/converter" element={<Converter />} />
      </Routes>
    </Router>
  );
}

export default App;
