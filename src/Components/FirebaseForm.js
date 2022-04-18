import React, { useState, Fragment } from "react";
import { getDocs } from "firebase/firestore";
import {
  FormControl,
  InputLabel,
  AlertTitle,
  Alert,
  OutlinedInput,
  Button,
} from "@mui/material";
import "../App.css";
import { FirebaseWriteQueries } from "../Functions/FirebaseWriteQueries";
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";

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

    let hasRequiredData = false;
    let hasUniqueID = null;

    // Check whether necessary data has been input to form
    if (props.formType === "userSignIn") {
      newUserID && newUserCourseFullStr
        ? (hasRequiredData = true)
        : (hasRequiredData = false);
    } else if (props.formType === "courseEntry") {
      newCourseName && newCourseID
        ? (hasRequiredData = true)
        : (hasRequiredData = false);
    }

    // Check whether course ID is unique when entering new course
    if (hasRequiredData && props.formType === "courseEntry") {
      // Returns bool for if course id exists in database
      const data = await FirebaseReadQueries({
        type: "checkCourseID",
        collectionName: "courses",
        courseID: newCourseID,
      });
      const documentSnapshots = await getDocs(data);

      documentSnapshots.docs[0] ? (hasUniqueID = false) : (hasUniqueID = true);
    } else {
      hasUniqueID = true;
    }

    // On success
    if (hasRequiredData && hasUniqueID) {
      buttonClickSuccess();
      setBlockingError([false, ""]); //Clear error if it's there

      console.log(newUserID, newUserCourseFullStr);

      // Write to database, just passes all possible params
      // Only uses what it needs for the desired collection
      FirebaseWriteQueries({
        collectionName: props.collectionName,
        newCourseName: newCourseName,
        newCourseID: newCourseID,
        newUserID: newUserID,
        newUserCourseID: newUserCourseID,
        newCourseFullStr: newUserCourseFullStr,
      });

      // Empty the inputs
      setNewUserID("");
      setNewUserCourseID("");
      setNewCourseName("");
      setNewCourseID("");
    } else if (!hasRequiredData) {
      setBlockingError([true, "Missing Required Field(s)"]);
      buttonClickFail("Error");
    } else if (!hasUniqueID) {
      setBlockingError([true, "Must Enter Unique Course ID"]);
      buttonClickFail("Error");
    }
  };

  return (
    <div className="firebase-signin-form">
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
        <Fragment>
          {!props.userID && (
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
          )}
          <br />
          {!props.courseID && (
            <FormControl>
              <InputLabel htmlFor="firebase-form-courseid">
                Course ID
              </InputLabel>
              <OutlinedInput
                required
                id="firebase-form-courseid"
                value={newCourseID}
                onChange={(e) => setNewCourseID(e.target.value)}
                label="Course ID"
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
    </div>
  );
};

export default FirebaseInputForm;
