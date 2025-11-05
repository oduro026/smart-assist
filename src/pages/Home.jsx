import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const HomePage = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3 px-4">
        <div className="container-fluid">
          <Link className="navbar-brand fw-bold text-primary" to="/">
            📘 SmartStudent
          </Link>
          <div className="d-flex ms-auto">
            <Link to="/login" className="btn btn-outline-primary me-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow-1 d-flex align-items-center justify-content-center text-center px-3">
        <div>
          <h1 className="display-5 fw-bold mb-3">
            Manage Your Academic Journey
          </h1>
          <p className="lead text-muted mb-4">
            Track your GPA, organize learning materials, and achieve academic
            excellence with SmartStudent Portal.
          </p>
          <Link to="/login" className="btn btn-primary btn-lg px-4">
            Get Started →
          </Link>
        </div>
      </section>

      {/* Key Features */}
      <section className="container my-5">
        <h3 className="fw-bold text-center mb-4">Key Features</h3>
        <div className="row g-4 justify-content-center">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <div className="mb-3 fs-2 text-primary">📖</div>
              <h5 className="fw-bold">Learning Materials</h5>
              <p className="text-muted">
                Upload, organize, and access all your study materials in one
                centralized location.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <div className="mb-3 fs-2 text-success">📊</div>
              <h5 className="fw-bold">GPA Tracking</h5>
              <p className="text-muted">
                Monitor your GPA in real-time with automatic calculations based
                on your grades.
              </p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100 text-center p-4">
              <div className="mb-3 fs-2 text-info">👥</div>
              <h5 className="fw-bold">Admin Dashboard</h5>
              <p className="text-muted">
                Administrators can view analytics and manage student data easily
                through the portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-center py-3 mt-auto shadow-sm">
        <small className="text-muted">
          © {new Date().getFullYear()} SmartStudent Portal. All Rights Reserved.
        </small>
      </footer>
    </div>
  );
};

export default HomePage;
