import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";



const Login = () => {
  const API_URL = process.env.REACT_APP_API_URL;


  const [indexNumber, setIndexNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/auth/local`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          identifier: indexNumber,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // 🟢 CRITICAL FIX: Get fullName from separate localStorage key
        const savedFullName = localStorage.getItem("userFullName") || "";
        
        // Create user object with fullName
        const userData = {
          ...data.user,
          fullName: savedFullName
        };
        
        localStorage.setItem("jwt", data.jwt);
        localStorage.setItem("user", JSON.stringify(userData));
        
        console.log("✅ Login successful - Full name:", savedFullName);
        navigate("/dashboard");
      } else {
        setError(data.error?.message || "Login failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="text-center mb-4">Student Login</h3>

        {error && (
          <div className="alert alert-danger text-center" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Index Number</label>
            <input
              type="text"
              className="form-control"
              value={indexNumber}
              onChange={(e) => setIndexNumber(e.target.value)}
              placeholder="Enter your index number"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>

        <div className="text-center">
          <small>
            Don't have an account?{" "}
            <Link to="/register" className="text-decoration-none">
              Register here
            </Link>
          </small>
        </div>
      </div>
    </div>
  );
};

export default Login;