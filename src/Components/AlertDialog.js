import React, { Fragment, useRef, useState } from "react";
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
import { CSVLink } from "react-csv";
import moment from "moment";
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";

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



  // Which data to export to csv
  const headers = [
    { label: "User ID", key: "userID" },
    { label: "Course Name", key: "courseName" },
    { label: "Course ID", key: "courseID" },
    { label: "Timestamp Logged", key: "timestampLogged" },
    // { label: "Last Modified", key: "lastModified" },
  ];
  const [data, setData] = useState(null);
  const csvLink = React.useRef();
  const getData = async (searchCriteria) => {
    console.log("CSV Export Query Data: ", searchCriteria)
    console.log("Generating CSV report with all data");

    // Repackages "props.queries" into searchCriteria
    // const searchCriteria = {
    //   // courseFullStr: this.props.queries.courseFullStr,
    //   courseID: props.queries.searchCourseID,
    //   userID: props.queries.searchUserID,
    //   startDate: props.queries.startDate,
    //   endDate: props.queries.endDate,
    //   searchArchived: props.queries.searchArchived
    // }
    
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
      setData(signinData)
      csvLink.current.link.click();
      // buttonClickSuccess()
    }
    else {
      // console.log("No data found")
      // setBlockingError([true, "No Data Found"])
      // buttonClickFail()
    }

  };


  // const handleSearch = (searchCriteria) => {
  //   console.log("CSV Export Query Data: ", searchCriteria)

  //   // Call the CSV export
  //   // childRef.current.getData(searchCriteria)
  // };

  // const childRef = useRef();

  // Contains multiple types depending on passed in prop
  return (
    <div>
      {props.type === "csvExport" && (
        <Fragment>
          {/* <AsyncCSV /> */}
          {data && <CSVLink
            headers={headers}
            filename={"SignInDataReport-" + moment().format("MMDDYYYY_HHmmss")}
            data={data}
            ref={csvLink}
          />}

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
                searchCriteria={getData}
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
