import React, { Component, useEffect, useState } from "react";
import { CSVLink } from "react-csv";

import {
  collection,
  getDocs,
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
} from "firebase/firestore";
import { db } from "../firebase-config";
import moment from "moment";
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";
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

// Which data to export to csv
const headers = [
  { label: "User ID", key: "userID" },
  { label: "Course Name", key: "courseName" },
  { label: "Course ID", key: "courseID" },
  { label: "Timestamp Logged", key: "timestampLogged" },
  // { label: "Last Modified", key: "lastModified" },
];



export default function AsyncCSV(props) {
  // Styling
  const [submitBtnColor, setSubmitBtnColor] = useState("primary");
  const [submitBtnText, setSubmitBtnText] = useState("Export All To CSV");
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [blockingError, setBlockingError] = useState([
    false,
    "Default Error Message",
  ]);

  const [data, setData] = useState(null);

  const csvLink = React.useRef();

  // Called by downloadReport, called after button submit
  // Collects data from firebase based on given queries
  const getData = async () => {
    buttonClickSuccess()
    
    console.log("Generating CSV report with all data");

    // Repackages "props.queries" into searchCriteria
    const searchCriteria = {
      // courseFullStr: this.props.queries.courseFullStr,
      courseID: props.queries.searchCourseID,
      userID: props.queries.searchUserID
    }

    const data = await FirebaseReadQueries({
      type: "CSV",
      searchCriteria: searchCriteria,
    });

    var documentSnapshots = await getDocs(data);

    // Push all data to array
    // Only maps specific data, and reformats timestamps
    let signinData = [];
    documentSnapshots.forEach((doc) => {
      signinData.push({
        userID: doc.data().userID,
        courseName: doc.data().courseName,
        courseID: doc.data().courseID,
        timestampLogged: moment(doc.data().timestampLogged.toDate())
          .local()
          .format("MM-DD-yyyy HH:mm:ss"),
      });
    });

    console.log(signinData);
    
    setData(signinData)
    csvLink.current.link.click();
  };

  const buttonClickSuccess = () => {
    setSubmitBtnColor("success");
    setSubmitBtnText("Success");
    setSubmitBtnDisabled(true);
  };

  return (
    <div>
      <Button
        // Disables pointer when disabled
        style={submitBtnDisabled ? { pointerEvents: "none" } : {}}
        id="submit-csv-button"
        variant="contained"
        color={submitBtnColor}
        onClick={getData}
      >
        {submitBtnText}
      </Button>

      {data && <CSVLink
        headers={headers}
        filename={"SignInDataReport-" + moment().format("MMDDYYYY_HHmmss")}
        data={data}
        ref={csvLink}
      />}
    </div>
  );
}
