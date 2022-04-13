import React, { Fragment, useRef, useState } from "react";
import Button from '@mui/material/Button';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
} from "@mui/material";
import CourseDropDown from "./CourseDropDown";
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
import CircularProgress from "@mui/material/CircularProgress";
import FirebaseForm from "./FirebaseForm";
import FirebaseDataTableSearch from "./FirebaseDataTableSearch";
import { CSVLink } from "react-csv";
import moment from "moment";
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";
import DialogExportCSV from "./DialogExportCSV";
import DialogCourseEntry from "./DialogCourseEntry";
import DialogCourseEdit from "./DialogCourseEdit";
import '../App.css'

export default function AlertDialog(props) {
  const [open, setOpen] = React.useState(false);
  // const loading = open && courseList.length === 0;

  let handleClickOpen = async () => {
    setOpen(true);
    // Only generate course list when opened
    // setCourseList(await getCourseList());
    // console.log(courseList);
  };

  function handleClose() {
    setOpen(false);
  }

  // Contains multiple types depending on passed in prop
  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        {props.type === "csvExport" && "Export to CSV"}
        {props.type === "courseEntry" && "Add New Course"}
        {props.type === "courseEdit" && "Edit Course"}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Optional Queries"}</DialogTitle>

        <DialogActions>
          {/* Handles things scpecific to type of dialog box */}
          {props.type === "csvExport" && <DialogExportCSV />}
          {props.type === "courseEntry" && <DialogCourseEntry />}
          {props.type === "courseEdit" && (
            <DialogCourseEdit
              currCourseName={props.currCourseName}
              currCourseID={props.currCourseID}
            />
          )}

          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
