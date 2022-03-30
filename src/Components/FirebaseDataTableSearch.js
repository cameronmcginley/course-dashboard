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
    const [searchArchived, setSearchArchived] = useState(false);
    const [showDateSelect, setShowDateSelect] = useState(false);
    const [dateRange, setDateRange] = useState([
      {
        startDate: null,
        endDate: null,
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
          endDate: endOfDay(dateRange[0].endDate),
          searchArchived: searchArchived
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
    endDate: endOfDay(dateRange[0].endDate),
    searchArchived: searchArchived
  }

  return (
    <Fragment>
      {console.log(TableHeaders(props)["sign-ins"])}
      <h1>Search Data</h1>

      {/* Sign in table search */}
      {props.searchType === "userSignIn" && (
        <div className="searchQueries userSignIn">
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

          <CourseDropDown selectedCourse={getDropdownData}/>

          <div class="break"></div>

          {/* Show the calendar when user selects btn */}
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

          <div class="break"></div>

          {/* Checkbox for searching for archived */}
          {/* <Checkbox
            checked={searchArchived}
            onChange={(e) => setSearchArchived(!searchArchived)}
            inputProps={{ 'aria-label': 'controlled' }}
          /> */}

          <div class="break"></div>

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

        </div>
      )}
    </Fragment>
  );
};

export default FirebaseDataTableSearch;
