import React, { useState, useEffect, useRef } from "react";
import AppNavbar from "../components/AppNavbar";

function GPA() {
  const [numCourses, setNumCourses] = useState(0);
  const [courses, setCourses] = useState([]);
  const [gpa, setGpa] = useState(0);
  const printRef = useRef();

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('studentGPAData');
    if (savedData) {
      try {
        const { courses: savedCourses, gpa: savedGpa, numCourses: savedNumCourses } = JSON.parse(savedData);
        setCourses(savedCourses || []);
        setGpa(savedGpa || 0);
        setNumCourses(savedNumCourses || 0);
        console.log("✅ Loaded saved GPA data from local storage");
      } catch (error) {
        console.error("❌ Error loading saved data:", error);
      }
    }
  }, []);

  // Save data to localStorage whenever courses or GPA change
  useEffect(() => {
    if (courses.length > 0 || gpa > 0) {
      const dataToSave = {
        courses,
        gpa,
        numCourses,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem('studentGPAData', JSON.stringify(dataToSave));
    }
  }, [courses, gpa, numCourses]);

  // Number of Courses
  const handleNumCoursesChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setNumCourses(count);
    
    if (count === 0) {
      setCourses([]);
      setGpa(0);
      // Clear localStorage when no courses
      localStorage.removeItem('studentGPAData');
      return;
    }

    // Preserve existing courses if reducing count, or add new ones
    const newCourses = Array.from({ length: count }, (_, i) => {
      // Keep existing course data if available
      if (courses[i]) {
        return courses[i];
      }
      return {
        id: i + 1,
        courseName: "",
        assessment: "",
        exam: "",
        creditHour: "",
        grade: "",
        gradePoint: 0,
      };
    });
    setCourses(newCourses);
  };

  // Handle field changes
  const handleCourseChange = (index, field, value) => {
    const updated = [...courses];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    setCourses(updated);
  };

  // Calculate GPA
  const calculateGPA =  () => {
    let totalPoints = 0;
    let totalCredits = 0;

    const updatedCourses = courses.map((course) => {
      const totalScore =
        Number(course.assessment || 0) + Number(course.exam || 0);
      let grade = "";
      let gradePoint = 0;
      const credit = Number(course.creditHour || 0);

      // Grading logic
      if (credit === 1) {
        if (totalScore >= 85) { grade = "A+"; gradePoint = 5; }
        else if (totalScore >= 80) { grade = "A"; gradePoint = 4.5; }
        else if (totalScore >= 75) { grade = "B+"; gradePoint = 4; }
        else if (totalScore >= 70) { grade = "B"; gradePoint = 3.5; }
        else if (totalScore >= 65) { grade = "C+"; gradePoint = 3; }
        else if (totalScore >= 60) { grade = "C"; gradePoint = 2.5; }
        else if (totalScore >= 55) { grade = "D+"; gradePoint = 2; }
        else if (totalScore >= 50) { grade = "D"; gradePoint = 1; }
        else { grade = "F"; gradePoint = 0; }
      } else if (credit === 2) {
        if (totalScore >= 85) { grade = "A+"; gradePoint = 10; }
        else if (totalScore >= 80) { grade = "A"; gradePoint = 9; }
        else if (totalScore >= 75) { grade = "B+"; gradePoint = 8; }
        else if (totalScore >= 70) { grade = "B"; gradePoint = 7; }
        else if (totalScore >= 65) { grade = "C+"; gradePoint = 6; }
        else if (totalScore >= 60) { grade = "C"; gradePoint = 5; }
        else if (totalScore >= 55) { grade = "D+"; gradePoint = 4; }
        else if (totalScore >= 50) { grade = "D"; gradePoint = 3; }
        else { grade = "F"; gradePoint = 0; }
      } else if (credit === 3) {
        if (totalScore >= 85) { grade = "A+"; gradePoint = 15; }
        else if (totalScore >= 80) { grade = "A"; gradePoint = 13.5; }
        else if (totalScore >= 75) { grade = "B+"; gradePoint = 12; }
        else if (totalScore >= 70) { grade = "B"; gradePoint = 10.5; }
        else if (totalScore >= 65) { grade = "C+"; gradePoint = 9; }
        else if (totalScore >= 60) { grade = "C"; gradePoint = 7.5; }
        else if (totalScore >= 55) { grade = "D+"; gradePoint = 6; }
        else if (totalScore >= 50) { grade = "D"; gradePoint = 4.5; }
        else { grade = "F"; gradePoint = 0; }
      }

      totalPoints += gradePoint;
      totalCredits += credit;
      return { ...course, grade, gradePoint };
    });

    setCourses(updatedCourses);
    const finalGPA =
      totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    setGpa(finalGPA);

    console.log("✅ GPA calculated and saved ");
    // After setting the GPA in your calculateGPA function:
    setGpa(finalGPA);

    // Notify the Dashboard
    window.dispatchEvent(new Event('gpaUpdated'));
  };



  // Clear all data
  const clearAllData = () => {
    setCourses([]);
    setGpa(0);
    setNumCourses(0);
    localStorage.removeItem('studentGPAData');
    console.log("🗑️ All data cleared");
  };

  // Print results
  const handlePrint = () => window.print();

  

  return (
    <div className="container">
      <AppNavbar />
      <h2 className="text-center mb-4 mt-4">GPA Calculator</h2>

      {/* Clear Data Button */}
      {(courses.length > 0 || gpa > 0) && (
        <div className="mb-3 text-end">
          <button className="btn btn-outline-danger btn-sm" onClick={clearAllData}>
            Clear All Data
          </button>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Enter Number of Courses:</label>
        <input
          type="number"
          className="form-control"
          value={numCourses}
          onChange={handleNumCoursesChange}
          min="0"
          max="20"
          
        />
      </div>

      {courses.map((course, index) => (
        <div key={index} className="card p-3 mb-3">
          <h5>Course {index + 1}</h5>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Course Name"
            value={course.courseName}
            onChange={(e) =>
              handleCourseChange(index, "courseName", e.target.value)
            }
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Assessment Score"
            value={course.assessment}
            onChange={(e) =>
              handleCourseChange(index, "assessment", e.target.value)
            }
            min="0"
            max="40"
           
             
          />
          <input
            type="number"
            className="form-control mb-2"
            placeholder="Exam Score"
            value={course.exam}
            onChange={(e) => handleCourseChange(index, "exam", e.target.value)}
            min="0"
            max="60"
          />
          <select
            className="form-select mb-2"
            value={course.creditHour}
            onChange={(e) =>
              handleCourseChange(index, "creditHour", e.target.value)
            }
          >
            <option value="">Select Credit Hour</option>
            <option value="1">1 Credit Hour</option>
            <option value="2">2 Credit Hours</option>
            <option value="3">3 Credit Hours</option>
          </select>

          {course.grade && (
            <p className="mb-0">
              <strong>Grade:</strong> {course.grade} |{" "}
              <strong>Grade Point:</strong> {course.gradePoint}
            </p>
          )}
        </div>
      ))}

      {numCourses > 0 && (
        <button className="btn btn-primary me-2" onClick={calculateGPA}>
          Calculate GPA
        </button>
      )}

      {gpa > 0 && (
        <>
          <div className="alert alert-info mt-4" ref={printRef}>
            <h4>Your GPA: {gpa}</h4>
            <table className="table table-striped mt-3">
              <thead>
                <tr>
                  <th>Course</th>
                  <th>Credit Hour</th>
                  <th>Assessment</th>
                  <th>Exam</th>
                  <th>Grade</th>
                  <th>Grade Point</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c, i) => (
                  <tr key={i}>
                    <td>{c.courseName}</td>
                    <td>{c.creditHour}</td>
                    <td>{c.assessment}</td>
                    <td>{c.exam}</td>
                    <td>{c.grade}</td>
                    <td>{c.gradePoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button className="btn btn-success mt-2 me-2 mb-3" onClick={handlePrint}>
            Print / Download GPA Report
          </button>
        </>
      )}
    </div>
  );
}

export default GPA;