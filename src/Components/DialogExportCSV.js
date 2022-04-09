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
import FirebaseDataTableSearch from "./FirebaseDataTableSearch";

// Which data to export to csv
const headers = [
  { label: "User ID", key: "userID" },
  { label: "Course Name", key: "courseName" },
  { label: "Course ID", key: "courseID" },
  { label: "Timestamp Logged", key: "timestampLogged" },
  // { label: "Last Modified", key: "lastModified" },
];



export default function DialogExportCSV(props) {
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
  const getData = async (searchCritera) => {
    console.log("Generating CSV report with all data");

    const data = await FirebaseReadQueries({
      type: "CSV",
      searchCriteria: searchCritera,
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
    
    // Only download if data found
    if (signinData.length) {
      setData(signinData)
      csvLink.current.link.click();
      buttonClickSuccess()
    }
    else {
      // console.log("No data found")
      setBlockingError([true, "No Data Found"])
      buttonClickFail()
    }

  };

  const buttonClickSuccess = () => {
    setSubmitBtnColor("success");
    setSubmitBtnText("Success");
    setSubmitBtnDisabled(true);
  };

  const buttonClickFail = (errMsg) => {
    setSubmitBtnColor("error");
    setSubmitBtnText("Error");
    setSubmitBtnDisabled(true);
    setTimeout(function () {
      setSubmitBtnColor("primary");
      setSubmitBtnText("Export All To CSV");
      setSubmitBtnDisabled(false);
      setBlockingError([false, ""])
    }, 2000);
  };

  return (
    <div>
        {data && 
        <CSVLink
            headers={headers}
            filename={"SignInDataReport-" + moment().format("MMDDYYYY_HHmmss")}
            data={data}
            ref={csvLink}
        />}

        {/* Takes same searches from the sign-ins table */}
        <FirebaseDataTableSearch 
            searchType="sign-ins"
            hasSubmit={false}
            searchCriteria={getData}
        />
    </div>
  );
}
