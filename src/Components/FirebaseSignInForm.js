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
import { FirebaseWriteQueries } from "../Functions/FirebaseWriteQueries"


// Can pass props in to exclude certain buttons, e.g. "userCourseID=123" in props
const FirebaseInputForm = (props) => {
  // Styling
  const [submitBtnColor, setSubmitBtnColor] = useState("primary")
  const [submitBtnText, setSubmitBtnText] = useState("Submit")
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false)
  const [missingInfoError, setMissingInfoError] = useState(false)

  //userSignIn
  const [newUserID, setNewUserID] = useState(props.userID);
  const [newUserCourseID, setNewUserCourseID] = useState(props.userCourseID);

  //courseEntry
  const [newCourseName, setNewCourseName] = useState(props.courseName);
  const [newCourseID, setNewCourseID] = useState(props.courseID);

  const buttonClickSuccess = () => {
    setSubmitBtnColor("success")
    setSubmitBtnText("Success")
    setSubmitBtnDisabled(true)
    setTimeout(function(){
        setSubmitBtnColor("primary")
        setSubmitBtnText("Submit")
        setSubmitBtnDisabled(false)
    }, 2000);
  }

  const buttonClickFail = (errMsg) => {
    setSubmitBtnColor("error")
    setSubmitBtnText(errMsg)
    setSubmitBtnDisabled(true)
    setTimeout(function(){
        setSubmitBtnColor("primary")
        setSubmitBtnText("Submit")
        setSubmitBtnDisabled(false)
    }, 2000);
  }

  const handleSubmit = async (e) => {
    // Prevent auto refresh when recieving event
    e.preventDefault();

    let hasRequiredData = false

    // Check whether necessary data has been input to form
    if (props.formType === "userSignIn") {
      newUserID && newUserCourseID ? hasRequiredData=true : hasRequiredData=false
    } else if (props.formType === "courseEntry") {
      newCourseName && newCourseID ? hasRequiredData=true : hasRequiredData=false
    }

    // On success
    if (hasRequiredData) {
      buttonClickSuccess()
      setMissingInfoError(false) //Clear error if it's there

      
      FirebaseWriteQueries({
        collectionName: props.collectionName,
        newCourseName: newCourseName,
        newCourseID: newCourseID,
        newUserID: newUserID,
        newUserCourseID: newUserCourseID,
      })

      // Add document to firebase
      // const logTime = new Date();
      // await addDoc(signinCollectionRef, {
      //     userID: newUserID,
      //     courseName: "temp",
      //     courseID: Number(newUserCourseID),
      //     timestampLogged: logTime,
      //     lastModified: logTime,
      //     sortKey: 9999999999999 - logTime,
      //     isArchived: false,
      //     // Firebase doesn't allow querying "string contains"
      //     // Add an array of all char combinations so we can search them later
      //     substrArrUserID: createSubstringArray(newUserID),
      // });

      // Empty the inputs
      setNewUserID("");
      setNewUserCourseID("");
      setNewCourseName("");
      setNewCourseID("");
    }
    // Not success (missing required fields)
    else {
      setMissingInfoError(true)
      buttonClickFail("Error")
    }
  }

  return (
    <div class="firebase-signin-form">


        {/* User Sign In Form */}
        {props.formType === "userSignIn" &&
          <Fragment>
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
                        value={newUserCourseID}
                        onChange={(e) => setNewUserCourseID(e.target.value)}
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
          </Fragment>
        }


        {/* Course Entry Form */}
        {props.formType === "courseEntry" &&
          <Fragment>
            {!props.userID && 
                <FormControl>
                    <InputLabel htmlFor="firebase-form-userid">Course Name</InputLabel>
                    <OutlinedInput
                        required
                        id="firebase-form-userid"
                        value={newCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                        label="Course Name"
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
                        onChange={(e) => setNewCourseID(e.target.value)}
                        label="Course ID"
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
          </Fragment>
        }


    </div>
  );
};

export default FirebaseInputForm;
