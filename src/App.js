import { useState, useEffect } from "react";
import "./App.css";
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

function App() {
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseID, setNewCourseID] = useState("");
  const [newFormURL, setNewFormURL] = useState("");
  const [newTimeCreated, setNewTimeCreated] = useState("");

  const [courses, setCourses] = useState([]);
  const coursesCollectionRef = collection(db, "courses");

  const createUser = async (e) => {
    // Prevent auto refresh when recieving event
    e.preventDefault();

    await addDoc(coursesCollectionRef, 
      { courseName: newCourseName, 
        courseID: Number(newCourseID),
        formURL: "https://docs.google.com/forms/d/e/1FAIpQLSdZv-dww4a_hH7NiQnACpuR0Nm9rKrnFDwpCOmaitxzj5T_3w/viewform?usp=pp_url&entry.1688819987=" + newCourseID,
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

  // called for rendering
  useEffect(() => {
    getCourses();
  }, []);

  return (
    <div className="App">
      <form onSubmit={createUser}>
        <input value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} placeholder="Course Name..." />
        <input value={newCourseID} onChange={(e) => setNewCourseID(e.target.value)} placeholder="Course ID..." />
        <button type="submit">Add Course</button>
      </form>

      {/* <button onClick={createUser}> Create User</button> */}

      <table>
        <tr>
          <th>Course Name</th>
          <th>Course ID</th>
          <th>Forms URL</th>
          <th>Time Created</th>
        </tr>

        {/* Adds each course as a row in the table */}
        {courses.map((course) => {
          return (
            <tr>
              <th>{course.courseName}</th>
              <th>{course.courseID}</th>
              <th>{course.formURL}</th>
              <th>{course.timeCreated.toDate().toDateString()} {course.timeCreated.toDate().toLocaleTimeString('en-US')}</th>

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



export default App;