import React, { useState, Fragment, useEffect } from "react";
import { getDocs } from "firebase/firestore";
import {
  FormControl,
  InputLabel,
  AlertTitle,
  Alert,
  OutlinedInput,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import "../App.css";
import { FirebaseWriteQueries } from "../Functions/FirebaseWriteQueries";
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";
import { CheckCourseSubmission } from "../Functions/InputChecks/CheckCourseSubmission";
import { CheckUserSignin } from "../Functions/InputChecks/CheckUserSignin";
import { AutoCourseID } from "../Functions/InputChecks/AutoCourseID";

// Can pass props in to exclude certain buttons, e.g. "userCourseID=123" in props
const FirebaseInputForm = (props) => {
  // Styling
  const [submitBtnColor, setSubmitBtnColor] = useState("primary");
  const [submitBtnText, setSubmitBtnText] = useState("Submit");
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  // const [missingInfoError, setMissingInfoError] = useState(false)
  const [blockingError, setBlockingError] = useState([
    false,
    "Default Error Message",
  ]);

  //userSignIn
  const [newUserID, setNewUserID] = useState(props.userID);
  const [newUserCourseID, setNewUserCourseID] = useState(props.userCourseID);
  const [newUserCourseFullStr, setNewUserCourseFullStr] = useState(
    props.userCourseFullStr
  );

  //courseEntry
  const [newCourseName, setNewCourseName] = useState(props.courseName);
  const [newCourseID, setNewCourseID] = useState(props.courseID);
  const [useAutoCourseID, setUseAutoCourseID] = useState(false);
  const [courseInstructor, setCourseInstructor] = useState("")
  const [sponsorAgency, setSponsorAgency] = useState("Wichita Police Department")
  const [instructorAgency, setInstructorAgency] = useState("Wichita Police Department")
  const [coordinator, setCoordinator] = useState("")
  const [synopsis, setSynopsis] = useState("")

  const buttonClickSuccess = () => {
    setSubmitBtnColor("success");
    setSubmitBtnText("Success");
    setSubmitBtnDisabled(true);
    setTimeout(function () {
      setSubmitBtnColor("primary");
      setSubmitBtnText("Submit");
      setSubmitBtnDisabled(false);
    }, 2000);
  };

  const buttonClickFail = (errMsg) => {
    setSubmitBtnColor("error");
    setSubmitBtnText(errMsg);
    setSubmitBtnDisabled(true);
    setTimeout(function () {
      setSubmitBtnColor("primary");
      setSubmitBtnText("Submit");
      setSubmitBtnDisabled(false);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    // Prevent auto refresh when recieving event
    e.preventDefault();

    let submittedCourseID = newCourseID
    let submittedCourseName = newCourseName
    let submittedUserID = newUserID
    let submittedUserCourseFullStr = newUserCourseFullStr
    let submittedUserCourseID = newUserCourseID

    // Form can either be for course input, or user sign in
    let isCourseValid = [null, null];
    let isUserSignInValid = [null, null]

    // Check for each, and if its valid
    if (props.formType === "courseEntry") {
      isCourseValid = await CheckCourseSubmission(
        false,
        submittedCourseName,
        submittedCourseID,
        useAutoCourseID
      );

      // If useAutoCourseID is true, CheckCourseSubmission will return a new courseID
      // That has been incremented
      if (isCourseValid[0] && useAutoCourseID) {
        submittedCourseID = isCourseValid[2]
      }
    }
    else if (props.formType === "userSignIn") {
      isUserSignInValid = CheckUserSignin(
        submittedUserID,
        submittedUserCourseFullStr
      );
    }
    
    // On success, write data
    // Either can be successful, FirebaseWriteQueries will handle all
    // the data given to it and use whats needed based on collectionName
    if (isCourseValid[0] || isUserSignInValid[0]) {
      buttonClickSuccess();
      setBlockingError([false, ""]); //Clear error if it's there

      // Write to database, just passes all possible params
      // Only uses what it needs for the desired collection
      FirebaseWriteQueries({
        collectionName: props.collectionName,
        newCourseName: submittedCourseName,
        newCourseID: submittedCourseID,
        newUserID: submittedUserID,
        newUserCourseID: submittedUserCourseID,
        newCourseFullStr: submittedUserCourseFullStr,
        // 
        courseInstructor: courseInstructor,
        sponsorAgency: sponsorAgency,
        instructorAgency: instructorAgency,
        coordinator: coordinator,
        synopsis: synopsis,
      });

      // Empty the inputs
      setNewUserID("");
      setNewUserCourseID("");
      setNewCourseName("");
      setNewCourseID("");
    } 
    // Check which was false, output error message
    else if (isUserSignInValid[0] === false) {
      setBlockingError([true, isUserSignInValid[1]]);
      buttonClickFail("Error");
      console.log(blockingError)
    } 
    else if (isCourseValid[0] === false) {
      setBlockingError([true, isCourseValid[1]]);
      buttonClickFail("Error");
    }
  };


  // Updating useAutoCourseID (checkbox) calls useEffect to get autoCourseID
  useEffect(async () => {
    // If enabled, fill the ID input box was constant
    console.log(newCourseID)
    if (useAutoCourseID) {
      setNewCourseID(String(await AutoCourseID()))
    }
    else {
      setNewCourseID(null)
    }
    console.log(newCourseID)
  }, [useAutoCourseID])

  return (
    <div className="firebase-signin-form ">
      {/* User Sign In Form */}
      {props.formType === "userSignIn" && (
        <Fragment>
          {!props.userID && (
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
          )}
          <br />
          {/* Make this a course drop down */}
          {!props.userCourseFullStr && (
            <FormControl>
              <InputLabel htmlFor="firebase-form-courseid">
                Course ID
              </InputLabel>
              <OutlinedInput
                required
                id="firebase-form-courseid"
                value={newUserCourseFullStr}
                onChange={(e) => setNewUserCourseFullStr(e.target.value)}
                label="User ID"
              />
            </FormControl>
          )}
          <br />
          {blockingError[0] && (
            <Alert
              severity="error"
              sx={{ mx: "auto", minWidth: "2rem", maxWidth: "20rem" }}
            >
              <AlertTitle>Error</AlertTitle>
              {blockingError[1]}
            </Alert>
          )}
          <FormControl>
            <Button
              // Disables pointer when disabled
              style={submitBtnDisabled ? { pointerEvents: "none" } : {}}
              id="submit-form-button"
              variant="contained"
              color={submitBtnColor}
              onClick={handleSubmit}
            >
              {submitBtnText}
            </Button>
          </FormControl>
        </Fragment>
      )}


      {/* Course Entry Form */}
      {props.formType === "courseEntry" && (
        <div className="searchQueries">
          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">
              Course Name
            </InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              label="Course Name"
            />
          </FormControl>

          <div className="break"></div>

          <FormControl>
            {/* Disable course ID input if we use auto generate */}
            <InputLabel htmlFor="firebase-form-courseid">
              Course ID
            </InputLabel>
            <OutlinedInput
              required
              disabled={useAutoCourseID}
              id="firebase-form-courseid"
              value={newCourseID}
              onChange={(e) => setNewCourseID(e.target.value)}
              label="Course ID"
            />

            {/* Select whether you want to auto generate course ID */}
            <FormControlLabel 
              control={
              <Checkbox
                checked={useAutoCourseID}
                onChange={(e) => setUseAutoCourseID(!useAutoCourseID)}
              />} 
              label={"Auto Generate ID: " + (useAutoCourseID ? "True" : "False")} />
          </FormControl>

          <div className="break"></div>

          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">
              Instructor(s)
            </InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              value={courseInstructor}
              onChange={(e) => setCourseInstructor(e.target.value)}
              label="Course Name"
            />
          </FormControl>

          <div className="break"></div>

          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">
              Sponsor Agency
            </InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              value={sponsorAgency}
              onChange={(e) => setSponsorAgency(e.target.value)}
              label="Course Name"
            />
          </FormControl>

          <div className="break"></div>

          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">
              Instructor Agency
            </InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              value={instructorAgency}
              onChange={(e) => setInstructorAgency(e.target.value)}
              label="Course Name"
            />
          </FormControl>

          <div className="break"></div>

          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">
              Coordinator
            </InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              value={coordinator}
              onChange={(e) => setCoordinator(e.target.value)}
              label="Course Name"
            />
          </FormControl>

          <div className="break"></div>

          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">
              Course Synopsis
            </InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
              label="Course Name"
            />
          </FormControl>

          <div className="break"></div>

          {blockingError[0] && (
            <Alert
              severity="error"
              sx={{ mx: "auto", minWidth: "2rem", maxWidth: "20rem" }}
            >
              <AlertTitle>Error</AlertTitle>
              {blockingError[1]}
            </Alert>
          )}

          <FormControl>
            <Button
              // Disables pointer when disabled
              style={submitBtnDisabled ? { pointerEvents: "none" } : {}}
              id="submit-form-button"
              variant="contained"
              color={submitBtnColor}
              onClick={handleSubmit}
            >
              {submitBtnText}
            </Button>
          </FormControl>

        </div>
      )}
    </div>
  );
};

export default FirebaseInputForm;
