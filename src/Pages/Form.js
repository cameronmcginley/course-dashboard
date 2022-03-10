import React, { Component, useState, useEffect } from "react";
import "./Form.css";
import { db, auth } from "../firebase-config";
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
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";

const createSubstringArray = (text) => {
  var substringArray = []
  var characterCounter = 1
  let textLowercased = text.toLowerCase()
  let characterCount = text.length
  // console.log(characterCount)

  // Create array of all substrings
  for (let _ = 0; _ < characterCount; _++) {
    for (let x = 0; x < characterCount; x++) {
        let lastCharacter = x + characterCounter
        if (lastCharacter <= characterCount) {
            let substring = textLowercased.substring(x, lastCharacter)//textLowercased[x..<lastCharacter]
            substringArray.push(substring)
        }
      }
      characterCounter += 1

      // let max = maximumStringSize
      let max = text.length
      if (characterCounter > max) {
          break
      }
  }
  
  // Remove duplicates from array
  substringArray =[...new Set(substringArray)];

  console.log(substringArray)
  return substringArray
}

const Form = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  
  if (!user) {
	  navigate('/login')
  }
  
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
        // Firebase doesn't allow querying "string contains"
        // Add an array of all char combinations so we can search them later
        substrArrUserID: createSubstringArray(newUserID)
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
