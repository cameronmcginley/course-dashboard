import React, { Component, useState, useEffect, Fragment } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { useParams } from "react-router-dom";
import FirebaseDataTable from "../Components/FirebaseDataTable";
import FirebaseForm from "../Components/FirebaseForm";
import { GetCourseName } from "../Functions/GetCourseName";
import DialogHandler from "../Components/DialogBox/DialogHandler";
import '../App.css'
import QRCode from "../Components/QRCode";
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
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  FieldValue,
  limit,
  orderBy,
  startAfter,
  startAt,
  endBefore,
  limitToLast,
  setState,
  where,
  Timestamp,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase-config";

const Attendance = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [courseName, setCourseName] = useState("");

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  if (!user) {
    navigate("/login");
  }

  // Get course id from url
  const { pageCourseID } = useParams();

  // Get the sort key given at start of day
  // const daySortKeyLargest = 9999999999999 - new Date().setHours(0, 0, 0, 0);
  // console.log(daySortKeyLargest);

  // Was having issues with the async return, kind of a werid
  // fix to have this function just call a function, but it works
  // since i can't make this entire component async
  const asyncGetCourseName = async () => {
    setCourseName(await GetCourseName(pageCourseID));
  };

  // Update the courseName based on the page's course ID
  useEffect(() => {
    if (!courseName) {
      asyncGetCourseName();
    }
  }, []);

  return (
    <Fragment>
      {courseName ? (
        <>
          {/* If courseName exists, check if it matches error message */}
          {courseName != "error" ? (
            // If not, do...
            <>
              <div className="attendanceCourseInfo">
                <p>Course ID: {pageCourseID}</p>
                <p>Course Name: {courseName}</p>
                <DialogHandler
                  type="courseEdit"
                  currCourseName={courseName}
                  currCourseID={pageCourseID}
                />
              </div>

              <div className="attendanceSignIn">
                <p>Course Sign In</p>
                <Paper className="attendanceFormAndQR" elevation={3}>
                  {/* Wait for courseName before loading the form, else
                  // // an empty prop will be passed */}
                  <Box className="attendanceForm">
                    <FirebaseForm
                      formType="userSignIn"
                      collectionName="sign-ins"
                      userCourseFullStr={courseName + " (ID " + pageCourseID + ")"}
                    />
                  </Box>

                  <Box className="attendanceSigninOR"><p>Or</p></Box>
                  
                  <Box className="attendanceQR">
                    <QRCode value={courseName + " (ID " + pageCourseID + ")"} />
                  </Box>
                </Paper>
              </div>

              <FirebaseDataTable
                type={"attendance"}
                accessor={"sign-ins"}
                sortKey={"sortKey"}
                pageCourseID={pageCourseID}
                excludeSearch={true}
                // daySortKeyLargest={daySortKeyLargest}
              />
            </>
          ) : (
            <div>Error</div>
          )}
        </>
      ) : (
        // While courseName undefined....
        <CircularProgress />
      )}
    </Fragment>
  );
};

export default Attendance;
