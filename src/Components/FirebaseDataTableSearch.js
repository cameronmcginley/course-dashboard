import React, { Component, useState, useEffect, Fragment } from "react";
import { db, auth } from "../firebase-config";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  FieldValue,
  query,
  limit,
  orderBy,
  startAfter,
  startAt,
  endBefore,
  limitToLast,
  setState,
  where,
  getDocs,
} from "firebase/firestore";
import {
  FormControl,
  FormLabel,
  FormHelperText,
  Input,
  InputLabel,
  AlertTitle,
  TextField,
  Alert,
  OutlinedInput,
  Button,
} from "@mui/material";
import "../App.css";
import { FirebaseWriteQueries } from "../Functions/FirebaseWriteQueries";
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";
import TableHeaders from "../Functions/FirebaseDataTable/TableHeaders"
import CourseDropDown from "./CourseDropDown";


const FirebaseDataTableSearch = (props) => {
    // Styling
    const [submitBtnColor, setSubmitBtnColor] = useState("primary");
    const [submitBtnText, setSubmitBtnText] = useState("Search");
    const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
    const [blockingError, setBlockingError] = useState([
      false,
      "Default Error Message",
    ]);
  
    // //userSignIn
    // const [newUserID, setNewUserID] = useState(props.userID);
    // const [newUserCourseID, setNewUserCourseID] = useState(props.userCourseID);
  
    // //courseEntry
    // const [newCourseName, setNewCourseName] = useState(props.courseName);
    // const [newCourseID, setNewCourseID] = useState(props.courseID);

    // All possible searches
    const [searchUserID, setSearchUserID] = useState(null);
    const [searchCourseName, setSearchCourseName] = useState(null);
    const [searchCourseID, setSearchCourseID] = useState(null);
    const [searchDateStart, setSearchDateStart] = useState(null);
    const [searchDateEnd, setSearchDateEnd] = useState(null);
    const [searchDateDay, setSearchDateDay] = useState(null);
    const [searchArchived, setSearchArchived] = useState(null);
  
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

      console.log("Search by", searchUserID, searchCourseName, searchCourseID, searchArchived)
      console.log(Boolean(searchArchived))

      // On success
      if (true) {
        buttonClickSuccess();
        setBlockingError([false, ""]); //Clear error if it's there

        props.searchCriteria({
          searchUserID: "a",
          searchCourseID: searchCourseID,
        })
  
        // Write to database, just passes all possible params
        // Only uses what it needs for the desired collection
        // FirebaseWriteQueries({
        //   collectionName: props.collectionName,
        //   newCourseName: newCourseName,
        //   newCourseID: newCourseID,
        //   newUserID: newUserID,
        //   newUserCourseID: newUserCourseID,
        // });
  
        // Empty the inputs
        // setSearchUserID("");
        // setSearchCourseName("");
        // setSearchCourseID("");
        // setSearchArchived("");
      } 
      // else if (!hasRequiredData) {
      //   setBlockingError([true, "Missing Required Field(s)"]);
      //   buttonClickFail("Error");
      // } else if (!hasUniqueID) {
      //   setBlockingError([true, "Must Enter Unique Course ID"]);
      //   buttonClickFail("Error");
      // }
    };
  
  
  
  // This function is called when user selects course from dropdown
  const getDropdownData = (data) => {
    console.log(data)
    // Update searchCritiera var before querying
    // searchCriteria = data
    // console.log(props.searchCriteria)
    // props.searchCriteria({
    //   searchCourseID: "26",
    // })
    setSearchCourseID("26")
    console.log("Dropdown select")

  
  };

  return (
    <Fragment>
      {console.log(TableHeaders(props)["sign-ins"])}

      {/* Sign in table search */}
      {props.searchType === "userSignIn" && (
        <Fragment>
          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">User ID</InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              // value={newUserID}
              onChange={(e) => setSearchUserID(e.target.value)}
              label="User ID"
            />
          </FormControl>

          <br />

          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">Course Name</InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              // value={newUserID}
              onChange={(e) => setSearchCourseName(e.target.value)}
              label="User ID"
            />
          </FormControl>

          <br />

          {/* <FormControl>
            <InputLabel htmlFor="firebase-form-userid">Course ID</InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              // value={newUserID}
              onChange={(e) => setSearchCourseID(e.target.value)}
              label="User ID"
            />
          </FormControl> */}
          <CourseDropDown selectedCourse={getDropdownData}/>

          {/* <br />

          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">Date</InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              value={newUserID}
              onChange={(e) => setNewUserID(e.target.value)}
              label="User ID"
            />
          </FormControl> */}

          <br />

          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">Archival Status</InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              // value={newUserID}
              onChange={(e) => setSearchArchived(e.target.value)}
              label="User ID"
            />
          </FormControl>

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
    </Fragment>
  );
};

export default FirebaseDataTableSearch;
