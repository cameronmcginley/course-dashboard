import React, { Component, useState, useEffect } from "react";
import "./Attendance.css";
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
import { useParams } from "react-router-dom";

const Attendance = () => {
  // Get course id from url
  const { courseid } = useParams()

  // Input form functions
  // --------------------------
  const [newUserName, setNewUserName] = useState("");
  const [newCourseID, setNewCourseID] = useState("");

  const signinCollectionRef = collection(db, "sign-ins");

  const saveData = async (e) => {
    // Prevent auto refresh when recieving event
    e.preventDefault();

    await addDoc(signinCollectionRef, 
      { userFirstName: newUserName, 
        courseID: courseid, 
        currentTime: new Date()
       });

    // Empty the inputs
    setNewUserName("")

    // Refresh list
    getSigninData();
  };

  // ---------------------
  // Data viewer
  const [signinData, setSigninData] = useState([]);
  const signinDataCollectionRef = collection(db, "sign-ins");

  const getSigninData = async () => {
      const data = await getDocs(signinDataCollectionRef);
      setSigninData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const deleteSignin = async (id) => {
      const signinDoc = doc(db, "sign-ins", id);
      await deleteDoc(signinDoc);
      getSigninData();
  };

  // called for rendering
  useEffect(() => {
      getSigninData();
  }, []);


  return (
    <div>
      <div>{courseid}</div>  

      {/* Input Form */}
      <div className="App">
        <form onSubmit={saveData} className="userSignin">
          <input value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Enter First Name.." />
          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Data viewer */}
      <div className="App">
        <table>
            <tr>
                <th>People Signed In</th>
                {/* <th>Course ID</th> */}
                {/* <th>Time Logged</th> */}
            </tr>

            {/* Adds each course as a row in the table */}
            {signinData.map((signin) => {
                // toDate() errors if there is no time saved
                const hasTime = Boolean(signin.currentTime);

                return (
                    <tr>
                        <th>{signin.userFirstName}</th>
                        {/* <th>{signin.courseID}</th> */}
                        {/* <th>
                            {hasTime
                                ? signin.currentTime
                                      .toDate()
                                      .toDateString() +
                                  " " +
                                  signin.currentTime
                                      .toDate()
                                      .toLocaleTimeString("en-US")
                                : ""}
                        </th> */}
                        <button
                            class="deletebtn"
                            onClick={() => {
                                deleteSignin(signin.id);
                            }}
                        >
                            Delete
                        </button>
                    </tr>
                );
            })}
        </table>
      </div>
    </div>
  );
}



export default Attendance;