import React, { useState } from "react";
import {
  FormControl,
  InputLabel,
  TextField,
  OutlinedInput,
  Button,
  Checkbox,
  Box,
  Card,
  MenuItem,
} from "@mui/material";
import "../App.css";
import CourseDropDown from "./CourseDropDown";
import SplitCourseFullStr from "../Functions/SplitCourseFullStr";

import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { endOfDay } from "date-fns";
import DialogHandler from "./DialogBox/DialogHandler";

const FirebaseDataTableSearch = (props) => {
  // Styling
  const [submitBtnColor, setSubmitBtnColor] = useState("primary");
  const [submitBtnText, setSubmitBtnText] = useState("Search");
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [blockingError, setBlockingError] = useState([
    false,
    "Default Error Message",
  ]);

  // All possible searches
  const [searchUserID, setSearchUserID] = useState("");
  const [searchCourseName, setSearchCourseName] = useState("");

  // const [searchCourseName, setSearchCourseName] = useState("");
  const [searchCourseID, setSearchCourseID] = useState("");

  // const [searchCourseID, setSearchCourseID] = useState("");
  const [searchCourseIDList, setSearchCourseIDList] = useState([]);

  const [doArchiveAfter, setDoArchiveAfter] = useState(false);

  const [searchArchived, setSearchArchived] = useState("unarchived");
  const [showDateSelect, setShowDateSelect] = useState(false);
  const [dateRange, setDateRange] = useState([
    {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  ]);

  const buttonClickSuccess = () => {
    setSubmitBtnColor("success");
    setSubmitBtnText("Success");
    setSubmitBtnDisabled(true);
    setTimeout(function () {
      setSubmitBtnColor("primary");
      setSubmitBtnText("Submit");
      setSubmitBtnDisabled(false);
    }, 2000);
  };

  const buttonClickFail = (errMsg) => {
    setSubmitBtnColor("error");
    setSubmitBtnText(errMsg);
    setSubmitBtnDisabled(true);
    setTimeout(function () {
      setSubmitBtnColor("primary");
      setSubmitBtnText("Submit");
      setSubmitBtnDisabled(false);
    }, 2000);
  };

  // Doesn't include the csv form
  const handleSubmit = async (e) => {
    // Prevent auto refresh when recieving event
    e.preventDefault();

    console.log(
      "Search by",
      searchUserID,
      searchCourseName,
      searchCourseID,
      searchCourseIDList,
      searchArchived
    );
    // console.log(Boolean(searchArchived))
    console.log("Date range picked: ", dateRange);

    // On success
    if (props.searchType === "sign-ins") {
      buttonClickSuccess();
      setBlockingError([false, ""]); //Clear error if it's there
      props.searchCriteria({
        searchUserID: searchUserID.toLowerCase(),
        searchCourseIDList: searchCourseIDList,
        searchCourseName: searchCourseName,
        startDate: dateRange[0].startDate,
        endDate: endOfDay(dateRange[0].endDate),
        searchArchived: searchArchived,
        doArchiveAfter: doArchiveAfter,
      });
    }
    if (props.searchType === "courses") {
      buttonClickSuccess();
      setBlockingError([false, ""]); //Clear error if it's there
      props.searchCriteria({
        searchCourseName: searchCourseName.toLowerCase(),
        searchCourseID: searchCourseID,
      });
    }

    // if (doArchiveAfter) {
    //   console.log("F\nF\nF\nF\nF\nF\nF\nF\nF\nArchiving Data");
    //   // Give everything an archive date
    //   // Page to delete archived date older than certain period?
    // }
  };

  // This function is called when user selects course from dropdown
  const getDropdownData = (data) => {
    // if (data.length === 0) { return }

    console.log("Dropdown select", data);

    // Map list of courseFullStrs to just their ID
    setSearchCourseIDList(data.map((x) => SplitCourseFullStr(x.course)[1]));
  };

  const handleDateRange = (data) => {
    console.log("Handling date range...", data);
    setDateRange(data);
  };

  return (
    <div className="tableSearch">
      {/* {console.log(TableHeaders(props)["sign-ins"])} */}
      {/* <h1>Search Data</h1> */}

      {/* Sign in table search */}
      {props.searchType === "sign-ins" && (
        <div className="searchQueries sign-ins">
          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">User ID</InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              // value={newUserID}
              onChange={(e) => setSearchUserID(e.target.value)}
              label="User ID"
            />
          </FormControl>

          <div className="break"></div>

          <CourseDropDown selectedCourse={getDropdownData} />

          <div className="break"></div>

          {/* Calendar in dialog box, selectedDateRange passed up after select
          button is pressed */}
          <DialogHandler
            isSingleDate={false}
            type="dateRangePicker"
            sendDateRangeUp={handleDateRange}
            fullWidth={true}
            DialogTitle="Select Date Range"
          />

          <div className="break"></div>

          {/* Input for searching for archived */}
          <TextField
            value={searchArchived}
            label="Archival Status"
            onChange={(e) => setSearchArchived(e.target.value)}
            select
          >
            <MenuItem value={"unarchived"}>Unarchived</MenuItem>
            <MenuItem value={"archived"}>Archived</MenuItem>
            <MenuItem value={"either"}>Either</MenuItem>
          </TextField>

          <div className="break"></div>

          {props.isCSV && (<>
            <Card variant="outlined" className="csvArchiveCheckbox">
              <h3>Archive after export: </h3>
              <Checkbox
                sx={{ height: "50%" }} // Remove margin
                checked={doArchiveAfter}
                onChange={(e) => setDoArchiveAfter(!doArchiveAfter)}
                inputProps={{ "aria-label": "controlled" }}
              />
              <h3>{doArchiveAfter ? "True" : "False"}</h3>
            </Card>

            <div className="break"></div>
            </>
          )}

          <FormControl>
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
          </FormControl>
        </div>
      )}

      {/* Course table search */}
      {props.searchType === "courses" && (
        <Box className="searchQueries courses">
          {/* <CourseDropDown selectedCourse={getDropdownData} /> */}
          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">Course Name</InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              // value={newUserID}
              onChange={(e) => setSearchCourseName(e.target.value)}
              label="User ID"
            />
          </FormControl>

          <div className="break"></div>

          <FormControl>
            <InputLabel htmlFor="firebase-form-userid">Course ID</InputLabel>
            <OutlinedInput
              required
              id="firebase-form-userid"
              // value={newUserID}
              onChange={(e) => setSearchCourseID(e.target.value)}
              label="User ID"
            />
          </FormControl>

          <div className="break"></div>

          <FormControl>
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
          </FormControl>
        </Box>
      )}
    </div>
  );
};

export default FirebaseDataTableSearch;
