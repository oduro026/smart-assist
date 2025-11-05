import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import AppNavbar from "../components/AppNavbar"; // Import navbar

const Profile = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [user, setUser] = useState(null);
  const [gpa, setGpa] = useState(0.0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🟢 Function to get GPA and courses data from localStorage
  const getGPAFromStorage = () => {
    try {
      const studentData = localStorage.getItem('studentGPAData');
      if (studentData) {
        const parsedData = JSON.parse(studentData);
        const gpaValue = parsedData.gpa ? parseFloat(parsedData.gpa) : 0;
        const coursesValue = parsedData.courses ? 
          parsedData.courses.filter(course => course.courseName && course.courseName.trim() !== '').length : 0;
        
        return { gpa: gpaValue, courses: coursesValue };
      }
      return { gpa: 0, courses: 0 };
    } catch (error) {
      console.error('Error reading GPA data:', error);
      return { gpa: 0, courses: 0 };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    
    // Load user data from localStorage first (for fullName)
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }

    // Load GPA data from localStorage
    const gpaData = getGPAFromStorage();
    setGpa(gpaData.gpa);
    setCoursesCount(gpaData.courses);

    // If token exists, also try to fetch fresh user data from Strapi
    if (token) {
      axios
        .get(`${API_URL}/api/users/me?populate=*`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          // Combine Strapi user data with localStorage fullName
          const combinedUser = {
            ...res.data,
            fullName: storedUser?.fullName || res.data.username
          };
          setUser(combinedUser);
          setLoading(false);
        })
        .catch(() => {
          // If API fails, use localStorage data and mark as loaded
          setLoading(false);
        });
    } else {
      setLoading(false);
      if (!storedUser) {
        setError("You must log in to view your profile.");
      }
    }

    //  Listen for GPA updates from other components
    const handleStorageChange = () => {
      const newData = getGPAFromStorage();
      setGpa(newData.gpa);
      setCoursesCount(newData.courses);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Check for updates periodically
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [API_URL]);

  //  Get performance status based on GPA
  const getPerformanceStatus = () => {
    if (gpa >= 4.0) return { level: 'Excellent', color: 'success', icon: '🚀' };
    if (gpa >= 3.0) return { level: 'Good', color: 'info', icon: '👍' };
    if (gpa >= 2.0) return { level: 'Average', color: 'warning', icon: '📊' };
    return { level: 'Needs Improvement', color: 'secondary', icon: '📈' };
  };

  const performance = getPerformanceStatus();

  //  Get display name (prefers fullName)
  const getDisplayName = () => {
    if (user?.fullName) return user.fullName;
    if (user?.username) return user.username;
    return 'Student';
  };

  if (loading) {
    return (
      <div>
        <AppNavbar />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <AppNavbar />
        <div className="container text-center mt-5">
          <div className="alert alert-danger">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppNavbar />
      <div className="container py-5">
        <div className="card shadow-lg border-0 mx-auto" style={{ maxWidth: "600px" }}>
          <div className="card-body text-center p-4">
            {/* Profile Header */}
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Profile Avatar"
              className="rounded-circle mb-3"
              width="120"
            />
            <h3 className="fw-bold text-primary">{getDisplayName()}</h3>
            <p className="text-muted mb-1">{user?.email || `${user?.username}@kstu.edu.gh`}</p>
            <p className="text-muted small">Index: {user?.username}</p>
            
            <hr className="my-4" />
            
            {/* Stats Grid */}
            <div className="row text-center mb-4">
              <div className="col-4">
                <div className="border-end">
                  <h4 className="fw-bold text-info mb-1">{coursesCount}</h4>
                  <small className="text-muted">Courses</small>
                </div>
              </div>
              <div className="col-4">
                <div className="border-end">
                  <h4 className={`fw-bold text-${performance.color} mb-1`}>{gpa.toFixed(2)}</h4>
                  <small className="text-muted">GPA</small>
                </div>
              </div>
              <div className="col-4">
                <h4 className="fw-bold text-warning mb-1">{performance.icon}</h4>
                <small className="text-muted">Performance</small>
              </div>
            </div>

            {/* Detailed Information */}
            <div className="row text-start px-3">
              <div className="col-12 mb-3">
                <strong className="d-block mb-1">Program:</strong>
                <p className="text-dark mb-0">Computer Science</p>
              </div>
              
              <div className="col-12 mb-3">
                <strong className="d-block mb-1">Current GPA:</strong>
                <p className={`fw-bold fs-5 text-${performance.color} mb-0`}>
                  {gpa.toFixed(2)} 
                  <span className="ms-2 small text-muted">({performance.level})</span>
                </p>
              </div>

              <div className="col-12 mb-3">
                <strong className="d-block mb-1">Academic Status:</strong>
                <div className={`badge bg-${performance.color} text-white px-3 py-2`}>
                  {performance.icon} {performance.level}
                </div>
              </div>

              {gpa > 0 && (
                <div className="col-12">
                  <div className="alert alert-light border">
                    <small className="text-muted">
                      <strong>Note:</strong> Your GPA is automatically updated when you calculate grades in the GPA calculator.
                    </small>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="d-grid gap-2 d-md-flex justify-content-center mt-4">
              <button
                className="btn btn-outline-primary me-2"
                onClick={() => alert("Profile editing will be added soon!")}
              >
                Edit Profile
              </button>
              <button
                className="btn btn-success"
                onClick={() => window.location.href = "/gpa"}
              >
                {gpa > 0 ? 'Update GPA' : 'Calculate GPA'}
              </button>
            </div>

            {/* Last Updated Info */}
            {gpa > 0 && (
              <div className="mt-3">
                <small className="text-muted">
                  Last calculated: {new Date().toLocaleDateString()}
                </small>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats Card */}
        {gpa > 0 && (
          <div className="card border-0 shadow-sm mt-4 mx-auto" style={{ maxWidth: "600px" }}>
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Academic Summary</h5>
              <div className="row text-center">
                <div className="col-6">
                  <div className="p-3 border rounded">
                    <h6 className="fw-bold text-primary">GPA Score</h6>
                    <h4 className={`fw-bold text-${performance.color}`}>{gpa.toFixed(2)}</h4>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 border rounded">
                    <h6 className="fw-bold text-primary">Courses Tracked</h6>
                    <h4 className="fw-bold text-info">{coursesCount}</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;