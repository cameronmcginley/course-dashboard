import React, { Component, useState, useEffect } from "react";
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

const Form = () => {
  const [newUserName, setNewUserName] = useState("");
  const [newCourseID, setNewCourseID] = useState("");

  const signinCollectionRef = collection(db, "sign-ins");

  const saveData = async (e) => {
    // Prevent auto refresh when recieving event
    e.preventDefault();

    await addDoc(signinCollectionRef, 
      { userFirstName: newUserName, 
        courseID: Number(newCourseID),
        currentTime: new Date()
       });

    // Empty the inputs
    setNewUserName("")
    setNewCourseID("")
  };

  return (
    <div className="App">
      <form onSubmit={saveData} className="userSignin">
        <input value={newUserName} onChange={(e) => setNewUserName(e.target.value)} placeholder="Enter First Name.." />
        <input value={newCourseID} onChange={(e) => setNewCourseID(e.target.value)} placeholder="Enter Course ID..." />
        <button type="submit">Add Course</button>
      </form>
    </div>  
  );
}



export default Form;