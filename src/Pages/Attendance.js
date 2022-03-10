import React, { Component, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Attendance.css";
import { db, auth } from "./firebase-config";
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
  const navigate = useNavigate()
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  
  if (!user) {
	  navigate('/login')
  }
  
  // Get course id from url
  const { pageCourseID } = useParams()

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
        courseID: pageCourseID, 
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
      <div>{pageCourseID}</div>  

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
                <th>People Signed In Today</th>
            </tr>

            {/* Adds each course as a row in the table */}
            {signinData.map((signin) => {
              // Verify date exists first
              if (Boolean(signin.currentTime)) {
                // Only show data if they signed in today
                // and are in the correct course id
                const dataDay = signin.currentTime.toDate().setHours(0,0,0,0);
                const currDay = new Date().setHours(0,0,0,0);

                if(dataDay == currDay && signin.courseID == pageCourseID) {
                // if (datesAreOnSameDay(signin.currentTime.toDate(), Date())) {
                  return (
                    <tr>
                      <th>{signin.userFirstName}</th>

                      <button
                        class="deletebtn"
                        onClick={() => {
                            deleteSignin(signin.id);
                        }}
                      > Delete </button>
                    </tr>
                  );
                }
              }
            })}
        </table>
      </div>
    </div>
  );
}



export default Attendance;
