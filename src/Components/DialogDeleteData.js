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
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import {
  subDays,
  startOfYear,
  addYears,
  endOfYear,
  isSameDay,
  endOfDay,
} from "date-fns";
import AlertDialog from './AlertDialog';

export default function DialogDeleteData(props) {
  // Styling
  const [submitBtnColor, setSubmitBtnColor] = useState("primary");
  const [submitBtnText, setSubmitBtnText] = useState("Export All To CSV");
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [blockingError, setBlockingError] = useState([
    false,
    "Default Error Message",
  ]);

  const [data, setData] = useState(null);

  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const csvLink = React.useRef();

  // Called by downloadReport, called after button submit
  // Collects data from firebase based on given queries
  const getData = async (searchCriteria) => {
    console.log("Generating CSV report with all data");

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

    // Only download if data found
    if (signinData.length) {
      setData(signinData);
      csvLink.current.link.click();
      buttonClickSuccess();
    } else {
      // console.log("No data found")
      setBlockingError([true, "No Data Found"]);
      buttonClickFail();
      return
    }

    // Passed by searchCriteria from FirebaseDataTableSearch
    // From an option in csv export
    if (searchCriteria.doArchiveAfter) {
      console.log("T\nT\nT\nT\nT\nT\nT\nArchiving...")

      await documentSnapshots.forEach((docSnapshot) => {
        let docRef = doc(db, 'sign-ins', docSnapshot.id);
        updateDoc(docRef, { isArchived: true })
      });
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
      setBlockingError([false, ""]);
    }, 2000);
  };

  const handleDelete = (dates) => {
    console.log("H\nH\nH\nH\nH\nH\nH\nH\nH\nH\nH\nH\n")
  }

  return (
    <div>
      <AlertDialog type="dateRangePicker" caller="DialogDeleteData" sendDateRangeUp={handleDelete}/>
    </div>
  );
}
