import React, { Component, useState, useEffect, Fragment } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";
import { useParams } from "react-router-dom";
import FirebaseDataTable from "../Components/FirebaseDataTable";
import FirebaseForm from "../Components/FirebaseForm";
import {GetCourseName} from "../Functions/GetCourseName";

const Attendance = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [courseName, setCourseName] = useState("")

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  if (!user) {
    navigate("/login");
  }

  // Get course id from url
  const { pageCourseID } = useParams();

  // Get the sort key given at start of day
  const daySortKeyLargest = 9999999999999 - new Date().setHours(0, 0, 0, 0);
  console.log(daySortKeyLargest);

  // Was having issues with the async return, kind of a werid
  // fix to have this function just call a function, but it works
  // since i can't make this entire component async
  const asyncGetCourseName = async () => {
    setCourseName(await GetCourseName(pageCourseID))
  }
  
  // Update the courseName based on the page's course ID
  useEffect(() => {
    if (!courseName) {
      asyncGetCourseName()
    }
  }, []);

  return (
    <Fragment>

      {courseName 
      ? 
        <>
        {/* If courseName exists, check if it matches error message */}
          {courseName != "error" 
          ?
            // If not, do...
            <>
              <div>
                Course ID: {pageCourseID}
                <br/>
                Course Name: {courseName}
              </div>

              {/* Wait for courseName before loading the form, else
              // // an empty prop will be passed */}
                  <FirebaseForm
                    formType="userSignIn"
                    collectionName="sign-ins"
                    userCourseFullStr={courseName + " (ID " + pageCourseID + ")"}
                />

              <FirebaseDataTable
                type={"attendance"}
                accessor={"sign-ins"}
                sortKey={"sortKey"}
                pageCourseID={pageCourseID}
                daySortKeyLargest={daySortKeyLargest}
              />
            </>
          :
            <div>Error</div>
          }
        </>
      :
        // While courseName undefined....
        <div>Loading</div>
      }

    </Fragment>
  );
};

export default Attendance;
