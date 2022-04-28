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
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [courseName, setCourseName] = useState("");
  const [currData, setCurrData] = useState([]);

  if (!auth.currentUser)
  {
	  navigate('/login');
  }
  else if (!auth.currentUser.emailVerified)
  {
	  navigate('/login');
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

    // Get all data
    // Find doc id by reading old course id
    var data = query(
      collection(db, "courses"),
      limit(1),
      where("courseID", "==", pageCourseID)
    );

    const documentSnapshots = await getDocs(data);
    setCurrData(documentSnapshots.docs[0].data())
    console.log("h\nh\nh\n", currData)
    console.log(courseName)
  };

  const deleteCourse = async () => {
    console.log("Deleting course ID ", pageCourseID)

    // Uses type checkCourseID since this is just matching ID to one doc
    // which is what we want to do here
    const courseDoc = await FirebaseReadQueries({
      type: "checkCourseID",
      collectionName: "courses",
      courseID: pageCourseID,
    });

    console.log(courseDoc[0].data())

    let docRef = doc(db, "courses", courseDoc[0].id);
    deleteDoc(docRef);

    navigate("/courses");
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
              {/* <FirebaseDataTable
                type={"attendanceInfo"}
                pageCourseID={pageCourseID}
                excludeSearch={true}
              /> */}
              <FirebaseDataTable
                type={"attendanceInfo"}
                pageCourseID={pageCourseID}
                excludeSearch={true}
                // sortKey={"sortKey"}
                dataType={"attendance-info"}
                dataTypeHeader={"attendance-info-header"}
              />

              <DialogHandler
                type="courseEdit"
                currCourseName={courseName}
                currCourseID={pageCourseID}
                currCourseInstructor={currData.courseInstructor}
                currSponsorAgency={currData.sponsorAgency}
                currInstructorAgency={currData.instructorAgency}
                currCoordinator={currData.coordinator}
                currSynopsis={currData.synopsis}
              />
              
              <div className="break"/>

              <DialogHandler
                type="confirmation"
                message="Are you sure you wish to delete this course permanently?"
                noCloseBtn={false}
                sendConfirm={deleteCourse}
                dialogBtnColor="error"
                confirmBtnColor="error"
                buttonTxt="delete"
              />

              <div className="attendanceSignIn">
                <p>Course Sign In</p>
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

                  <Box className="attendanceSigninOR">
                    <p>Or</p>
                  </Box>

                  <Box className="attendanceQR">
                    <QRCode value={courseName + " {ID " + pageCourseID + "}"} />
                    <PrintQRReport value={courseName + " {ID " + pageCourseID + "}"} />
                  </Box>
                </Paper>
              </div>

              {/* <FirebaseDataTable
                type={"attendance"}
                accessor={"sign-ins"}
                sortKey={"sortKey"}
                pageCourseID={pageCourseID}
                excludeSearch={true}
                // daySortKeyLargest={daySortKeyLargest}
              /> */}

              {/* <Box sx={{ width: "25%" }}> */}
              <FirebaseDataTable
                type={"attendance"}
                accessor={"sign-ins"}
                sortKey={"sortKey"}
                pageCourseID={pageCourseID}
                excludeSearch={true}
                // daySortKeyLargest={daySortKeyLargest}
                dataType={"attendance"}
                dataTypeHeader={"attendance-header"}
                tableStyle={"attendance"}
              />
              {/* </Box> */}


            </Box>
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
