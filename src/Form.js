import React, { Component, useState, useEffect } from "react";
import "./Form.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  FieldValue,
  serverTimestamp 
} from "firebase/firestore";

const Form = () => {
  const [newUserID, setNewUserID] = useState("");
  const [newCourseID, setNewCourseID] = useState("");

  const signinCollectionRef = collection(db, "sign-ins");

  const saveData = async (e) => {
    // Prevent auto refresh when recieving event
    e.preventDefault();

    const logTime = serverTimestamp();
    await addDoc(signinCollectionRef, 
      { userID: newUserID, 
        courseName: 'temp',
        courseID: Number(newCourseID),
        timestampLogged: logTime,
        lastModified: logTime,
        sortKey: 9999999999999 - logTime,
        isArchived: false,
       });

    // Empty the inputs
    setNewUserID("")
    setNewCourseID("")
  };

  return (
    <div className="App">
      <form onSubmit={saveData} className="userSignin">
        <input value={newUserID} onChange={(e) => setNewUserID(e.target.value)} placeholder="Enter User ID..." />
        <input value={newCourseID} onChange={(e) => setNewCourseID(e.target.value)} placeholder="Enter Course ID..." />
        <button type="submit">Submit</button>
      </form>
    </div>  
  );
}



export default Form;