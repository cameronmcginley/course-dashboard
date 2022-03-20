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
import SplitCourseFullStr from "../Functions/SplitCourseFullStr"


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
    const [searchUserID, setSearchUserID] = useState("");
    const [searchCourseName, setSearchCourseName] = useState("");
    const [searchCourseID, setSearchCourseID] = useState("");
    const [searchDateStart, setSearchDateStart] = useState("");
    const [searchDateEnd, setSearchDateEnd] = useState("");
    const [searchDateDay, setSearchDateDay] = useState("");
    const [searchArchived, setSearchArchived] = useState("");
  
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
          searchUserID: searchUserID,
          searchCourseID: searchCourseID,
        })
      } 
    };
  
  // This function is called when user selects course from dropdown
  const getDropdownData = (data) => {
    console.log("Dropdown select", data)

    // Func returns ["courseName", "id"]
    console.log(data.course)
    let courseSelection = SplitCourseFullStr(data.course)
 
    setSearchCourseID(courseSelection[1])
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
{/* 
          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">Archival Status</InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              // value={newUserID}
              onChange={(e) => setSearchArchived(e.target.value)}
              label="User ID"
            />
          </FormControl> */}

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
