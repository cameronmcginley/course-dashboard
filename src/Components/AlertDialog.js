import React, { Fragment } from "react";
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

  let queries = {
    userID: null,
    // courseName: null,
    // courseID: null,
    courseFullStr: null
  };

  const getDropdownData = (data) => {
    console.log("Dropdown select", data)

    // Func returns ["courseName", "id"]
    console.log(data.course)
    // let courseSelection = SplitCourseFullStr(data.course)
 
    // setSearchCourseID(courseSelection[1])
    console.log(data, "YOOO")

    queries.courseFullStr = data.course
  };

  // Contains multiple types depending on passed in prop
  return (
    <div>
      {props.type === "csvExport" && (
        <Fragment>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Export to CSV
          </Button>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              {"Optional Queries"}
            </DialogTitle>

            <DialogActions>
              {/* Takes same searches from the sign-ins table */}
              <FirebaseDataTableSearch 
                searchType="sign-ins"
                hasSubmit={false}
              />

              <Button onClick={handleClose} color="primary" autoFocus>
                Close
              </Button>
              
            </DialogActions>
          </Dialog>
        </Fragment>
      )}

      {props.type === "courseEntry" && (
        <Fragment>
          <Button variant="outlined" color="primary" onClick={handleClickOpen}>
            Add Course
          </Button>

          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Add Course"}</DialogTitle>

            <DialogActions>
              <FirebaseForm formType="courseEntry" collectionName="courses" />

              <Button onClick={handleClose} color="primary" autoFocus>
                Close
              </Button>
            </DialogActions>
          </Dialog>
        </Fragment>
      )}
    </div>
  );
}
