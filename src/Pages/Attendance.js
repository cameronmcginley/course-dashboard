import React, { Component, useState, useEffect, Fragment } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Attendance.css";
import { auth } from "../firebase-config";
import { useParams } from "react-router-dom";
import FirebaseDataTable from "../Components/FirebaseDataTable";
import FirebaseSignInForm from "../Components/FirebaseSignInForm";

const Attendance = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  if (!user) {
    navigate("/login");
  }

  // Get course id from url
  const { pageCourseID } = useParams();

  // Get the sort key given at start of day
  const daySortKeyLargest = 9999999999999 - (new Date().setHours(0, 0, 0, 0))
  console.log(daySortKeyLargest)

  return (
    <Fragment>

      <FirebaseSignInForm courseID={pageCourseID}/>

      <FirebaseDataTable 
        type={"attendance"} 
        accessor={"sign-ins"} 
        sortKey={"sortKey"}
        pageCourseID={pageCourseID}
        daySortKeyLargest={daySortKeyLargest}/> 

    </Fragment>
  );
}

export default Attendance;
