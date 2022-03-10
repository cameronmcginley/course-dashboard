import React, { Component, useState, useEffect, Fragment } from "react";
import { db, auth } from "../firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  FieldValue,
  serverTimestamp,
} from "firebase/firestore";
import { FormControl, FormLabel, FormHelperText, Input, InputLabel, AlertTitle, TextField, Alert, OutlinedInput, Button } from '@mui/material';
import "../App.css"

// Convert text to array of all possible substrings
// Necessary for filtering, as firebase doesn't allow to search for substrings
const createSubstringArray = (text) => {
  var substringArray = [];
  var characterCounter = 1;
  let textLowercased = text.toLowerCase();
  let characterCount = text.length;
  // console.log(characterCount)

  // Create array of all substrings
  for (let _ = 0; _ < characterCount; _++) {
    for (let x = 0; x < characterCount; x++) {
      let lastCharacter = x + characterCounter;
      if (lastCharacter <= characterCount) {
        let substring = textLowercased.substring(x, lastCharacter); //textLowercased[x..<lastCharacter]
        substringArray.push(substring);
      }
    }
    characterCounter += 1;

    // let max = maximumStringSize
    let max = text.length;
    if (characterCounter > max) {
      break;
    }
  }

  // Remove duplicates from array
  substringArray = [...new Set(substringArray)];

  console.log(substringArray);
  return substringArray;
};

const FirebaseInputForm = (props) => {
  // Styling
  const [submitBtnColor, setSubmitBtnColor] = useState("primary")
  const [submitBtnText, setSubmitBtnText] = useState("Submit")
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)
  const [missingInfoError, setMissingInfoError] = useState(false)

  // Data
  const [newUserID, setNewUserID] = useState(props.userID);
  const [newCourseID, setNewCourseID] = useState(props.courseID);
  const signinCollectionRef = collection(db, "sign-ins");

  const handleSubmit = async (e) => {
    // Prevent auto refresh when recieving event
    e.preventDefault();

    console.log(newUserID)
    console.log(newCourseID)

    // On success
    if (newUserID && newCourseID) {
        // Update button
        setSubmitBtnColor("success")
        setSubmitBtnText("Success")
        setSubmitBtnDisabled(true)
        setTimeout(function(){
            setSubmitBtnColor("primary")
            setSubmitBtnText("Submit")
            setSubmitBtnDisabled(false)
        }, 2000);

        // Add document to firebase
        const logTime = new Date();
        await addDoc(signinCollectionRef, {
            userID: newUserID,
            courseName: "temp",
            courseID: Number(newCourseID),
            timestampLogged: logTime,
            lastModified: logTime,
            sortKey: 9999999999999 - logTime,
            isArchived: false,
            // Firebase doesn't allow querying "string contains"
            // Add an array of all char combinations so we can search them later
            substrArrUserID: createSubstringArray(newUserID),
        });

        // Empty the inputs
        setNewUserID("");
        setNewCourseID("");
    }
    // Not success (missing required fields)
    else {
        console.log("Missing required information")

        // Call error alert
        setMissingInfoError(true)

        // Update button
        setSubmitBtnColor("error")
        setSubmitBtnText("Error")
        setSubmitBtnDisabled(true)
        setTimeout(function(){
            setSubmitBtnColor("primary")
            setSubmitBtnText("Submit")
            setSubmitBtnDisabled(false)
        }, 2000);
    }
  }

  return (
    <div class="firebase-signin-form">
        {/* Only render if not passed in through props already */}
        {!props.userID && 
            <FormControl>
                <InputLabel htmlFor="firebase-form-userid">User ID</InputLabel>
                <OutlinedInput
                    required
                    id="firebase-form-userid"
                    value={newUserID}
                    onChange={(e) => setNewUserID(e.target.value)}
                    label="User ID"
                />
            </FormControl>
        }

        <br />

        {!props.courseID && 
            <FormControl>
                <InputLabel htmlFor="firebase-form-courseid">Course ID</InputLabel>
                <OutlinedInput
                    required
                    id="firebase-form-courseid"
                    value={newCourseID}
                    onChange={(e) => setNewUserID(e.target.value)}
                    label="User ID"
                />
            </FormControl>
        }

        <br />
        
        {missingInfoError &&
          <Alert severity="error" sx={{ mx: "auto", minWidth: '2rem', maxWidth: '20rem' }}>
            <AlertTitle>Error</AlertTitle>
            Missing required information</Alert>
        }

        <FormControl>
            <Button 
                // Disables pointer when disabled
                style={submitBtnDisabled ? { pointerEvents: 'none' } : {}}
                id="submit-form-button"
                variant="contained"
                color={submitBtnColor}
                onClick={handleSubmit}
            >{submitBtnText}</Button>
        </FormControl>
    </div>
  );
};

export default FirebaseInputForm;
