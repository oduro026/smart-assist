import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Book } from "react-bootstrap-icons";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from "react-router-dom";
import "./AppNavbar.css";


function AppNavbar() {
  return (
    <Navbar bg="white" expand="lg" className="border-bottom container-fluid">
      <Container>
        
        <Navbar.Brand href="/" className="d-flex align-items-center fw-bold text-dark">
          <Book className="me-2 fs-4" />
          SmartAssist
        </Navbar.Brand>

        

        
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-center">
          <Nav className="mx-auto" >
            <Link to="/dashboard" className="fw-medium mx-2 css-nav-link">
              Dashboard
            </Link>
            <Link to="/help" className="fw-medium mx-2 css-nav-link" >
              Help Assistant
            </Link>
            <Link to="/gpa" className="fw-medium mx-2 css-nav-link">
              GPA
            </Link>
          </Nav>
        </Navbar.Collapse>

        {/* Right Side (Email + Menu icon) */}
        <div className="d-flex align-items-center">
          <Link to="/profile" className=" fw-medium mx-2 css-nav-link">Profile</Link>
          <i className="bi bi-list fs-4"></i>
        </div>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
