import React, { useState, useEffect, Fragment } from "react";
import { emailVerified } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { useParams } from "react-router-dom";
import FirebaseDataTable from "../Components/FirebaseDataTable";
import FirebaseForm from "../Components/FirebaseForm";
import { GetCourseName } from "../Functions/GetCourseName";
import DialogHandler from "../Components/DialogBox/DialogHandler";
import "../App.css";
import QRCode from "../Components/QRCode";
import { Box, CircularProgress, Paper, Container } from "@mui/material";
import PrintQRReport from "../Components/PrintQRReport"
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries"
import { getDocs, deleteDoc, doc, query, collection, limit,where } from "firebase/firestore";
import { db } from "../firebase-config";


const Attendance = () => {
  const [courseName, setCourseName] = useState("");
  const [courseData, setCourseData] = useState([]);
  
  // Get course id from url
  const { pageCourseID } = useParams();

  // Was having issues with the async return, kind of a werid
  // fix to have this function just call a function, but it works
  // since i can't make this entire component async
  const asyncGetCourseName = async () => {
    setCourseName(await GetCourseName(pageCourseID));

    // Get all data
    // Find doc id by reading old course id
    var data = query(
      collection(db, "courses"),
      limit(1),
      where("courseID", "==", pageCourseID)
    );

    const documentSnapshots = await getDocs(data);
    if (documentSnapshots.docs[0]) {setCourseData(documentSnapshots.docs[0].data())}
  };

  // Update the courseName based on the page's course ID
  // Get other data with it
  useEffect(() => {
    if (!courseName) {
      asyncGetCourseName();
    }
  }, []);

  return (
    <Fragment>
      {/* Uses course name to check if page is valid */}
      {courseName ? (
        <>
          {/* If courseName exists, check if it matches error message */}
          {courseName != "error" ? (
            // If not, do...
            <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center">
            <FirebaseDataTable
                type={"attendance-info"}
                pageCourseID={pageCourseID}
                excludeSearch={true}
                dataType={"attendance-info"}
                dataTypeHeader={"attendance-info-header"}
                tableStyle={"attendance-info"}
              />

              <div className="break"/>

              <div className="attendanceSignIn">
                <p>Course Sign-In</p>
                <p>Course: {courseName}</p>
                <Paper className="attendanceFormAndQR" elevation={3}>
                  {/* Wait for courseName before loading the form, else
                  // // an empty prop will be passed */}
                  <Box className="attendanceForm">
                    <FirebaseForm
                      formType="userSignIn"
                      collectionName="sign-ins"
                      userCourseFullStr={
                        courseName + " {ID " + pageCourseID + "}"
                      }
                    />
                  </Box>
                </Paper>
              </div>

            </Box>
          ) : (
            <div>Page Not Found</div>
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
