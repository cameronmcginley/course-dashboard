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
import CourseDropDown from "../CourseDropDown";
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
import { db } from "../../firebase-config";
import CircularProgress from "@mui/material/CircularProgress";
import FirebaseForm from "../FirebaseForm";
import FirebaseDataTableSearch from "../FirebaseDataTableSearch";
import { CSVLink } from "react-csv";
import moment from "moment";
import { FirebaseReadQueries } from "../../Functions/FirebaseReadQueries";
import DialogExportCSV from "./DialogExportCSV";
import DialogCourseEntry from "./DialogCourseEntry";
import DialogCourseEdit from "./DialogCourseEdit";
import '../../App.css'
import DialogDeleteData from "./DialogDeleteData";
import DialogDateRangePicker from "./DialogDateRangePicker";
import DialogConfirmation from "./DialogConfirmation";

export default function DialogHandler(props) {
  const [open, setOpen] = React.useState(false);
  // const [dialogBtnColor, setDialogBtnColor] = React.useState("primary")
  // const loading = open && courseList.length === 0;

  let handleClickOpen = async () => {
    setOpen(true);
    // Only generate course list when opened
    // setCourseList(await getCourseList());
    // console.log(courseList);
  };

  function handleClose(event, reason) {
    if (reason && reason == "backdropClick") {
      return;
    }
    setOpen(false);
  }

  // let testFunc = (data) => {
  //   props.dateRange = data;
  // }

  // Response from DialogDateRangePicker
  // Closes the dialog, then redirects to function
  // provided by the caller of the date picker
  const onDateSelect = (data) => {
    props.sendDateRangeUp(data)
    handleClose()
  }

  // Response from DialogConfirmation
  // Closes the dialog, then redirects to function
  // provided by the caller of the confirmation box
  const onConfirm = (data) => {
    props.sendConfirm()
    handleClose()
  }

  // Contains multiple types depending on passed in prop
  return (
    <div> 
      {/* If props.dialogBtnColor isn't set it defaults to "primary" */}
      <Button variant="outlined" color={props.dialogBtnColor} onClick={handleClickOpen}>
        {props.type === "csvExport" && "Export to CSV"}
        {props.type === "courseEntry" && "Add New Course"}
        {props.type === "courseEdit" && "Edit Course"}
        {props.type === "deleteData" && "Delete Archived Data"}
        {props.type === "dateRangePicker" && "Select Date"}
        {props.type === "confirmation" && "Delete"}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
          <DialogTitle id="alert-dialog-title">{"Dialog Title"}</DialogTitle>

          <DialogActions>
            <div className="dialogMain">
              {/* Handles things scpecific to type of dialog box */}
              {props.type === "csvExport" && <DialogExportCSV />}
              {props.type === "courseEntry" && <DialogCourseEntry />}
              {props.type === "courseEdit" && (
                <DialogCourseEdit
                  currCourseName={props.currCourseName}
                  currCourseID={props.currCourseID}
                />
              )}
              {props.type === "deleteData" && <DialogDeleteData />}
              {/* Passes dateRange from DialogDateRangePicker to its caller */}
              {props.type === "dateRangePicker" && <DialogDateRangePicker isSingleDate={props.isSingleDate} sendDateRangeUp={onDateSelect}/>}
              {props.type === "confirmation" && 
                <DialogConfirmation 
                  message={props.message}
                  sendConfirm={onConfirm}
                  confirmBtnColor="error"
                  buttonTxt="delete"
                />}


              {/* Hide close button date pickers, custom select button instead */}
              {!props.noCloseBtn &&
              <Button onClick={handleClose} color="primary" autoFocus>
                Cancel
              </Button>
              }
            </div>
          </DialogActions>
      </Dialog>
    </div>
  );
}
