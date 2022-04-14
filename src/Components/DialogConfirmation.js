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
  Timestamp,
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
import getSortKey from '../Functions/getSortKey';

export default function DialogDeleteData(props) {
  // Styling
  const [submitBtnColor, setSubmitBtnColor] = useState("primary");
  const [submitBtnText, setSubmitBtnText] = useState("Export All To CSV");
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [blockingError, setBlockingError] = useState([
    false,
    "Default Error Message",
  ]);

  const [date, setDate] = useState(null);
  const [dateStr, setDateStr] = useState("");


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


  return (
    <div>
      <p>
        {props.message}
      </p>

      <Button
        variant="outlined"
        onClick={props.sendConfirm}
      >Confirm
      </Button>

    </div>
  );
}
