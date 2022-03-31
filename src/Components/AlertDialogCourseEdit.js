import React, { Fragment, useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Checkbox,
  Alert,
  AlertTitle,
} from "@mui/material";
import AsyncCSV from "./AsyncCSV";
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
import { FirebaseWriteQueries } from "../Functions/FirebaseWriteQueries";
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";

export default function AlertDialog(props) {
  const [open, setOpen] = useState(false);

  const [submitBtnColor, setSubmitBtnColor] = useState("primary");
  const [submitBtnText, setSubmitBtnText] = useState("Submit Changes");
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [blockingError, setBlockingError] = useState([
    false,
    "Default Error Message",
  ]);

  const [newCourseName, setNewCourseName] = useState("");
  const [editingCourseName, setEditingCourseName] = useState(false);

  const [newCourseID, setNewCourseID] = useState("");
  const [editingCourseID, setEditingCourseID] = useState(false);

  let handleClickOpen = async () => {
    setOpen(true);
  };

  function handleClose() {
    setOpen(false);
  }

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
      setSubmitBtnText("Submit Changes");
      setSubmitBtnDisabled(false);
    }, 2000);
  };

  const handleSubmit = async (e) => {
    // Prevent auto refresh when recieving event
    e.preventDefault();

    let hasRequiredData = false;
    let hasUniqueID = null;
    
    if (editingCourseName) {
      // Implement checks later, seperate func file
      hasRequiredData = newCourseName
    }
    if (editingCourseID) {
      hasRequiredData = newCourseID
    }


    if (hasRequiredData) {
      // Returns bool for if course id exists in database
      const data = await FirebaseReadQueries({
        type: "checkCourseID",
        collectionName: "courses",
        courseID: newCourseID,
      });

      const documentSnapshots = await getDocs(data);

      documentSnapshots.docs[0] ? (hasUniqueID = false) : (hasUniqueID = true);
    }

    // On success
    if (hasUniqueID) {
      buttonClickSuccess();
      setBlockingError([false, ""]); //Clear error if it's there

      console.log(newCourseName, newCourseID);

      // Set the changed data in firebase
      FirebaseWriteQueries({
        type: "courseEdit",
        currCourseName: props.currCourseName,
        currCourseID: props.currCourseID,
        newCourseName: newCourseName,
        newCourseID: newCourseID,
      });

      // // Write to database, just passes all possible params
      // // Only uses what it needs for the desired collection
      // FirebaseWriteQueries({
      //   collectionName: props.collectionName,
      //   newCourseName: newCourseName,
      //   newCourseID: newCourseID,
      //   newUserID: newUserID,
      //   newUserCourseID: newUserCourseID,
      //   newCourseFullStr: newUserCourseFullStr, 
      // });

      // // Empty the inputs
      // setNewUserID("");
      // setNewUserCourseID("");
      // setNewCourseName("");
      // setNewCourseID("");
    } 
    // Create more error messages later
    else if (hasRequiredData && !hasUniqueID) {
      setBlockingError([true, "Must Enter Unique Course ID"]);
      buttonClickFail("Error");
    }
    else {
      setBlockingError([true, "No Changes"]);
      buttonClickFail("Error");
    }
  };

  // Contains multiple types depending on passed in prop
  return (
    <Fragment>
        <Button variant="outlined" color="primary" onClick={handleClickOpen}>
          Edit Course
        </Button>

        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">{"Add Course"}</DialogTitle>

            <DialogActions>
                <div className="flexForm">
                    {/* Course Name */}
                    <TextField
                        disabled={!editingCourseName}
                        id="outlined-disabled"
                        label="Course Name"
                        defaultValue={props.currCourseName}
                        onChange={(e) => setNewCourseName(e.target.value)}
                    />
                    <Checkbox
                        checked={editingCourseName}
                        onChange={(e) => setEditingCourseName(!editingCourseName)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <div className="break" />

                    {/* Course ID */}
                    <TextField
                        disabled={!editingCourseID}
                        id="outlined-disabled"
                        label="Course ID"
                        defaultValue={props.currCourseID}
                        onChange={(e) => setNewCourseID(e.target.value)}
                    />
                    <Checkbox
                        checked={editingCourseID}
                        onChange={(e) => setEditingCourseID(!editingCourseID)}
                        inputProps={{ 'aria-label': 'controlled' }}
                    />
                    <div className="break" />

                    {blockingError[0] && (
                      <Alert
                        severity="error"
                        sx={{ mx: "auto", minWidth: "2rem", maxWidth: "20rem" }}
                      >
                        <AlertTitle>Error</AlertTitle>
                        {blockingError[1]}
                      </Alert>
                    )}

                    <div className="break" />
                    
                    {/* Submit Button */}
                    <Button
                      // Disables pointer when disabled
                      style={submitBtnDisabled ? { pointerEvents: "none" } : {}}
                      id="submit-form-button"
                      variant="contained"
                      color={submitBtnColor}
                      onClick={handleSubmit}
                    >
                      {submitBtnText}
                    </Button>

                    <div className="break" />
            
                    <Button onClick={handleClose} color="primary" autoFocus>
                        Close
                    </Button>
                </div>
            </DialogActions>
        </Dialog>
    </Fragment>
  );
}
