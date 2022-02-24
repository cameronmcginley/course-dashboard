import React, { Component, useState, useEffect, useRef } from "react";
import "./App.css";
import "./Courses.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  FieldValue,
} from "firebase/firestore";

import QRCode from "./QRCode"
import ReactToPrint from "react-to-print";


import { QrPrint } from './QrPrint';



const Courses = () => {
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseID, setNewCourseID] = useState("");
  const [newFormURL, setNewFormURL] = useState("");
  const [newTimeCreated, setNewTimeCreated] = useState("");

  const [courses, setCourses] = useState([]);
  const coursesCollectionRef = collection(db, "courses");

  const createCourse = async (e) => {
    // Prevent auto refresh when recieving event
    e.preventDefault();

    await addDoc(coursesCollectionRef, 
      { courseName: newCourseName, 
        courseID: Number(newCourseID),
        timeCreated: new Date()
       });

    // Empty the inputs
    setNewCourseName("")
    setNewCourseID("")

    // Refresh users list for render
    getCourses();
  };

  const deleteCourse = async (id) => {
    const courseDoc = doc(db, "courses", id);
    await deleteDoc(courseDoc);
    getCourses();
  };

  const getCourses = async () => {
    const data = await getDocs(coursesCollectionRef);
    setCourses(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };
  
  // Unique qr reference for each course, so not overwritten by the map func
  // https://github.com/gregnb/react-to-print/issues/323#issuecomment-986947323
  const qrPrintRefs = useRef([]);
	useEffect(() => {
		qrPrintRefs.current = qrPrintRefs.current.slice(0, courses.length);
	}, [courses]);

  // called for rendering
  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="App">
      <form onSubmit={createCourse} className="courseEntryForm">
        <input value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} placeholder="Course Name..." />
        <input value={newCourseID} onChange={(e) => setNewCourseID(e.target.value)} placeholder="Course ID..." />
        <button type="submit">Add Course</button>
      </form>

      <table>
        <tr>
          <th>Course Name</th>
          <th>Course ID</th>
          <th>QR Code</th>
          <th>Live Attendance Sheet + Sign In</th>
        </tr>

        {/* Adds each course as a row in the table */}
        {courses.map((course, i) => {
          // toDate() errors if there is no time saved
          // const hasTime = Boolean(course.timeCreated)
          let key={i}

          return (
            <tr>
              <th>{course.courseName}</th>

              <th>{course.courseID}</th>

              <th>
                {/* Displayed QR Code */}
                <QRCode value={course.courseID.toString()}/>
                
                {/* Print Button */}
                {/* https://github.com/gregnb/react-to-print/issues/83 */}
                {/* https://github.com/gregnb/react-to-print/issues/323#issuecomment-986947323 */}
                <ReactToPrint
                  trigger={() => <button>Print</button>}
                  content={() => { return qrPrintRefs.current[i]; }}
                />

                {/* Content to print, hidden with display: none */}
                <QrPrint value={course.courseID.toString()} ref={(el) => (qrPrintRefs.current[i] = el)} />
              </th>

              <th><a href={"/courses/" + course.courseID + "/attendance"} rel="noreferrer">Link</a></th>
              
              <button class="deletebtn"
                onClick={() => {
                  deleteCourse(course.id);
                }}
              >
                Delete Course
              </button>

            </tr>
          );
        })}
      </table>

    </div>  
  );
}



export default Courses;