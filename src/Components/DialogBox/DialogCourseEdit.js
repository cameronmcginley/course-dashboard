import React, { Fragment, useState } from "react";
import Button from "@mui/material/Button";
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
  Checkbox,
  Alert,
  AlertTitle,
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
import { FirebaseWriteQueries } from "../../Functions/FirebaseWriteQueries";
import { FirebaseReadQueries } from "../../Functions/FirebaseReadQueries";
import { CheckCourseSubmission } from "../../Functions/InputChecks/CheckCourseSubmission";

export default function DialogCourseEdit(props) {
  const [successPage, setSuccessPage] = useState(false);

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

    console.log(newCourseName, newCourseID);
    const isCourseValid = await CheckCourseSubmission(
      true,
      newCourseName,
      newCourseID
    );
    console.log(isCourseValid);

    if (isCourseValid[0]) {
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

      // Loading bar on success, waits for data to save then reloads
      // or redirects to new url
      setSuccessPage(true);
      setTimeout(function () {
        newCourseID
          ? (document.location = "/courses/" + newCourseID + "/attendance")
          : (document.location =
              "/courses/" + props.currCourseID + "/attendance");
        setSuccessPage(false);
      }, 3000);
    } else {
      setBlockingError([true, isCourseValid[1]]);
      buttonClickFail("Error");
    }
  };

  // Contains multiple types depending on passed in prop
  return (
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
        inputProps={{ "aria-label": "controlled" }}
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
        inputProps={{ "aria-label": "controlled" }}
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

      {/* Dont show submit/close after success, show loading bar */}
      {!successPage ? (
        <>
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
        </>
      ) : (
        <>
          <h1>Success!</h1>
          <div className="break" />
          <CircularProgress />
        </>
      )}
    </div>
  );
}
