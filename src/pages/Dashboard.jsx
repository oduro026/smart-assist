import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppNavbar from '../components/AppNavbar';
import ChatbotCard from '../components/ChatbotCard';

function Dashboard() {
  const [gpa, setGpa] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [user, setUser] = useState(null);

  //  Get user data from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    console.log("👤 User data loaded:", storedUser);
    
    // Load GPA and courses data
    const initialData = getDataFromStorage();
    setGpa(initialData.gpa);
    setCoursesCount(initialData.courses);
    

  }, []);

  // Enhanced function to get GPA and courses from local storage
  const getDataFromStorage = () => {
    try {
      const studentData = localStorage.getItem('studentGPAData');
      let gpaValue = 0;
      let coursesValue = 0;

      if (studentData) {
        const parsedData = JSON.parse(studentData);
        if (parsedData.gpa && parsedData.gpa > 0) {
          gpaValue = parseFloat(parsedData.gpa);
        }
        if (parsedData.courses && Array.isArray(parsedData.courses)) {
          coursesValue = parsedData.courses.filter(course => 
            course.courseName && course.courseName.trim() !== ''
          ).length;
        }
      }
      
      return { gpa: gpaValue, courses: coursesValue };
    } catch (error) {
      console.error('Error reading data from storage:', error);
      return { gpa: 0, courses: 0 };
    }
  };

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const newData = getDataFromStorage();
      setGpa(newData.gpa);
      setCoursesCount(newData.courses);
    };

    window.addEventListener('storage', handleStorageChange);
    const interval = setInterval(handleStorageChange, 2000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  //  Safely calculate numeric GPA
  const numericGpa = parseFloat(gpa) || 0.0;

  //  Get display name
  const getDisplayName = () => {
    if (user?.fullName && user.fullName.trim() !== '') {
      return user.fullName;
    }
    
    const savedFullName = localStorage.getItem("userFullName");
    if (savedFullName && savedFullName.trim() !== '') {
      return savedFullName;
    }
    
    // Finally fall back to username
    if (user?.username) {
      return user.username;
    }
    
    return 'Student';
  };

  // 🟢 Get performance status
  const getPerformanceStatus = () => {
    if (numericGpa >= 4.0) return { level: 'Excellent', color: 'success', icon: '🚀' };
    if (numericGpa >= 3.0) return { level: 'Good', color: 'info', icon: '👍' };
    if (numericGpa >= 2.0) return { level: 'Average', color: 'warning', icon: '📊' };
    return { level: 'Needs Improvement', color: 'secondary', icon: '📈' };
  };

  const performance = getPerformanceStatus();

  return (
    <div className="container-fluid py-4" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="mb-4">
        <AppNavbar />
      </div>

      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-5">
        <div>
          {/* 🟢 Display full name if available, otherwise username */}
          <h1 className="h3 fw-bold text-dark mb-1">Welcome back, {getDisplayName()}!</h1>
          <p className="text-muted mb-0">Here's your academic overview</p>
        </div>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="row">
        {/* Left Column - Stats Cards */}
        <div className="col-lg-8">
          <div className="row g-4">
            {/* Current GPA Card */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-muted mb-3">Current GPA</h6>
                  <div className="d-flex align-items-baseline mt-4">
                    <h2 className="fw-bold text-primary fs-3 mb-0">{numericGpa.toFixed(2)}</h2>
                    {numericGpa > 0 && (
                      <span className="ms-2 text-success smallfw-bold">
                        {numericGpa >= 3.0 ? '↑ On Track' : '→ Needs Focus'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Courses Card */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-muted mb-3">Courses</h6>
                  <h2 className="fw-bold text-info mb-0">{coursesCount}</h2>
                  <p className="text-muted small mb-3">Active courses tracked</p>
                  <Link to="/gpa" className="btn btn-outline-info btn-sm">
                    Manage Courses
                  </Link>
                </div>
              </div>
            </div>

            {/* Chatbot Card */}
            <ChatbotCard />

            {/* Performance Card */}
            <div className="col-md-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h6 className="card-title text-muted mb-3">Performance</h6>
                  <div className="d-flex align-items-center">
                    <span className="fs-4 me-2">{performance.icon}</span>
                    <h4 className={`fw-bold text-${performance.color} mb-0`}>
                      {performance.level}
                    </h4>
                  </div>
                  <p className="text-muted small mt-2">
                    {numericGpa > 0 
                      ? 'Based on your current GPA' 
                      : 'Calculate GPA to see your performance'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="card border-0 shadow-sm mt-4">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-4">Quick Actions</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 border rounded">
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">ICT Help Bot</h6>
                      <p className="text-muted small mb-0">Hi! How can I help you?</p>
                    </div>
                    <Link to="/help" className="btn btn-primary btn-sm ms-3">
                      Chat
                    </Link>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 border rounded">
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">Track GPA</h6>
                      <p className="text-muted small mb-0">Monitor your grades</p>
                    </div>
                    <Link to="/gpa" className="btn btn-success btn-sm ms-3">
                      Track
                    </Link>
                  </div>
                </div>
                
                <div className="col-md-6">
                  <div className="d-flex align-items-center p-3 border rounded">
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1">Manage Profile</h6>
                      <p className="text-muted small mb-0">Update your account</p>
                    </div>
                    <Link to="/profile" className="btn btn-secondary btn-sm ms-3">
                      Manage
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="col-lg-4">
          

          {/* Recent Courses */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title fw-bold mb-3">Recent Courses</h5>
              {coursesCount > 0 ? (
                <div>
                  <div className="text-center py-3">
                    <div className="text-success mb-2">
                      <strong>{coursesCount} courses tracked</strong>
                    </div>
                    <small className="text-muted">View all courses in GPA calculator</small>
                  </div>
                  <Link to="/gpa" className="btn btn-outline-primary btn-sm w-100">
                    View All Courses
                  </Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <div className="text-muted mb-2">No courses yet.</div>
                  <small className="text-info">Start tracking your grades!</small>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Dashboard;