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
} from "@mui/material";
import "../App.css";
import TableHeaders from "../Functions/FirebaseDataTable/TableHeaders"
import CourseDropDown from "./CourseDropDown";
import SplitCourseFullStr from "../Functions/SplitCourseFullStr"
import AsyncCSV from "./AsyncCSV";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker, defaultStaticRanges  } from 'react-date-range';
import { subDays, startOfYear, addYears, endOfYear, isSameDay, endOfDay } from 'date-fns';

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
    const [searchCourseID, setSearchCourseID] = useState("");
    const [searchArchived, setSearchArchived] = useState("");
    const [showDateSelect, setShowDateSelect] = useState(false);
    const [dateRange, setDateRange] = useState([
      {
        startDate: subDays(new Date(), 6),
        endDate: new Date(),
        key: 'selection'
      }
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

      console.log("Search by", searchUserID, searchCourseName, searchCourseID, searchArchived)
      // console.log(Boolean(searchArchived))
      console.log("Date range picked: ", dateRange)

      // On success
      if (true) {
        buttonClickSuccess();
        setBlockingError([false, ""]); //Clear error if it's there
        props.searchCriteria({
          searchUserID: searchUserID,
          searchCourseID: searchCourseID,
          startDate: dateRange[0].startDate,
          endDate: endOfDay(dateRange[0].endDate)
        })
      } 
    };
  
  // This function is called when user selects course from dropdown
  const getDropdownData = (data) => {
    console.log("Dropdown select", data)

    // Func returns ["courseName", "id"]
    console.log(data.course)
    let courseSelection = SplitCourseFullStr(data.course)
 
    setSearchCourseID(courseSelection[1])
  };

  let csvQueries = {
    searchUserID: searchUserID,
    searchCourseID: searchCourseID,
    startDate: dateRange[0].startDate,
    endDate: endOfDay(dateRange[0].endDate)
  }

  return (
    <Fragment>
      {console.log(TableHeaders(props)["sign-ins"])}

      {/* Sign in table search */}
      {props.searchType === "userSignIn" && (
        <Fragment>
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

          <br />

          <CourseDropDown selectedCourse={getDropdownData}/>

          <br />

          {/* Show the calendar when user selects */}
          {!showDateSelect 
          ? 
            <Button 
              variant="outlined"
              onClick={() => setShowDateSelect(true)}>
            Select Date Range
            </Button>
          :
            <DateRangePicker
              onChange={item => setDateRange([item.selection])}
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
                    endDate: endOfDay(new Date())
                  }),
                  isSelected(range) {
                    const definedRange = this.range();
                    return (
                      isSameDay(range.startDate, definedRange.startDate) &&
                      isSameDay(range.endDate, definedRange.endDate)
                    );
                  }
                },
                {
                  label: "Last Year",
                  range: () => ({
                    startDate: startOfYear(addYears(new Date(), -1)),
                    endDate: endOfYear(addYears(new Date(), -1))
                  }),
                  isSelected(range) {
                    const definedRange = this.range();
                    return (
                      isSameDay(range.startDate, definedRange.startDate) &&
                      isSameDay(range.endDate, definedRange.endDate)
                    );
                  }
                }
              ]}
            />
          }

          <br />

          {blockingError[0] && (
            <Alert
              severity="error"
              sx={{ mx: "auto", minWidth: "2rem", maxWidth: "20rem" }}
            >
              <AlertTitle>Error</AlertTitle>
              {blockingError[1]}
            </Alert>
          )}


          {props.hasSubmit
          ?
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
          :
          // Only doesn't have submit if its for CSV
          // Uses seperate queries obj, since searchCriteria only made 
          // by submit button
          <AsyncCSV queries={csvQueries} />
          }

        </Fragment>
      )}
    </Fragment>
  );
};

export default FirebaseDataTableSearch;
