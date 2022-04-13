import React, { Component, useState, useEffect, Fragment } from "react";
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
  Checkbox,
  Box,
  Paper,
  Card,
  Select,
  MenuItem,
} from "@mui/material";
import { Timestamp } from "firebase/firestore";
import "../App.css";
import TableHeaders from "../Functions/FirebaseDataTable/TableHeaders";
import CourseDropDown from "./CourseDropDown";
import SplitCourseFullStr from "../Functions/SplitCourseFullStr";

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
      searchCourseIDList,
      searchArchived
    );
    // console.log(Boolean(searchArchived))
    console.log("Date range picked: ", dateRange);

    // On success
    if (true) {
      buttonClickSuccess();
      setBlockingError([false, ""]); //Clear error if it's there
      props.searchCriteria({
        searchUserID: searchUserID,
        searchCourseIDList: searchCourseIDList,
        searchCourseName: searchCourseName,
        startDate: dateRange[0].startDate,
        endDate: endOfDay(dateRange[0].endDate),
        searchArchived: searchArchived,
        doArchiveAfter: doArchiveAfter,
      });
    }

    if (doArchiveAfter) {
      console.log("F\nF\nF\nF\nF\nF\nF\nF\nF\nArchiving Data")
      // Give everything an archive date
      // Page to delete archived date older than certain period?
    }
  };

  // This function is called when user selects course from dropdown
  const getDropdownData = (data) => {
    // if (data.length === 0) { return }

    console.log("Dropdown select", data);

    // Map list of courseFullStrs to just their ID
    console.log("X\nX\nX\nX\nX\nX\nX\nX\nX\nX\nX\n")
    console.log(data.map(x => SplitCourseFullStr(x.course)[1]))
    setSearchCourseIDList(data.map(x => SplitCourseFullStr(x.course)[1]))
  };

  return (
    <div className="tableSearch">
      {console.log(TableHeaders(props)["sign-ins"])}
      <h1>Search Data</h1>

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

          <div class="break"></div>

          <CourseDropDown selectedCourse={getDropdownData} />

          <div class="break"></div>

          {/* Show the calendar when user selects btn */}
          {!showDateSelect ? (
            <Button variant="outlined" onClick={() => setShowDateSelect(true)}>
              Select Date Range
            </Button>
          ) : (
            <DateRangePicker
              onChange={(item) => setDateRange([item.selection])}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={1}
              ranges={dateRange}
              direction="horizontal"
              staticRanges={[
                ...defaultStaticRanges,
                {
                  label: "This Year",
                  range: () => ({
                    startDate: startOfYear(new Date()),
                    endDate: endOfDay(new Date()),
                  }),
                  isSelected(range) {
                    const definedRange = this.range();
                    return (
                      isSameDay(range.startDate, definedRange.startDate) &&
                      isSameDay(range.endDate, definedRange.endDate)
                    );
                  },
                },
                {
                  label: "Last Year",
                  range: () => ({
                    startDate: startOfYear(addYears(new Date(), -1)),
                    endDate: endOfYear(addYears(new Date(), -1)),
                  }),
                  isSelected(range) {
                    const definedRange = this.range();
                    return (
                      isSameDay(range.startDate, definedRange.startDate) &&
                      isSameDay(range.endDate, definedRange.endDate)
                    );
                  },
                },
              ]}
            />
          )}

          <div class="break"></div>

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

          <div class="break"></div>

          {props.isCSV && (
            <Card variant="outlined" className="csvArchiveCheckbox">
              <h3>Archive after export: </h3>
              <Checkbox
                sx={{ height: '50%' }} // Remove margin
                checked={doArchiveAfter}
                onChange={(e) => setDoArchiveAfter(!doArchiveAfter)}
                inputProps={{ "aria-label": "controlled" }}
              />
              <h3>{doArchiveAfter ? "True" : "False"}</h3>
            </Card >
          )}

          <div class="break"></div>

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
          <CourseDropDown selectedCourse={getDropdownData} />

          {/* <div class="break" /> */}

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
