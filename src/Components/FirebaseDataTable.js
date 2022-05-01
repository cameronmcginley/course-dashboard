import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import React, { Fragment } from "react";
import styled from "styled-components";
import { useTable } from "react-table";

import { getDocs } from "firebase/firestore";
import { auth } from "../firebase-config";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton, Box, ThemeProvider, createTheme } from "@mui/material";
import { green, orange } from '@mui/material/colors';

import { useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// FirebaseDataTable Table Data
import TableHeaders from "../Functions/TableHeaders";
import TableStyles from "../Functions/TableStyles";

// DB Queries
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";

import FirebaseDataTableSearch from "./FirebaseDataTableSearch";

function BasicTable({ pageNum, setPageNum, tableTitle, dataType, dataTypeHeader, rowData, isAttendanceInfo, isFirstPage, isLastPage, getSigninData, tableStyle }) {
  const [isNextDisabled, setIsNextDisabled] = React.useState();
  const [isPreviousDisabled, setIsPreviousDisabled] = React.useState();

  return (
    <Box sx={TableStyles(tableStyle)}>
    <h1>{tableTitle}</h1>
    <TableContainer component={Paper} variant="outlined" square >
      <Table sx={{ minWidth: 0 }} aria-label="simple table">
        <TableHead>
          <TableHeaders type={dataTypeHeader} />
        </TableHead>
        <TableBody>
          {rowData.map((row) => (
            <TableRow
              // key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              style={{ verticalAlign: 'top' }}
            >
              <TableHeaders type={dataType} row={row} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {!isAttendanceInfo && (<div className="pagination">
        <IconButton
          onClick={() => {
            setPageNum(pageNum - 1);
            setIsPreviousDisabled(true);
            setTimeout(() => {
              setIsPreviousDisabled(false);
            }, 300);
            getSigninData("previous");
          }}
          // Disabled based on click delay, or if its first page (the timeout would re-enable even if first page)
          disabled={isPreviousDisabled || isFirstPage}
        >
          <ArrowBackIcon />
        </IconButton>{" "}
        <span>
          <p>
            Page
            <strong> {pageNum} </strong>
          </p>
        </span>
        <IconButton
          onClick={() => {
            setPageNum(pageNum + 1);
            setIsNextDisabled(true);
            setTimeout(() => {
              setIsNextDisabled(false);
            }, 300);
            getSigninData("next");
          }}
          disabled={isNextDisabled || isLastPage}
        >
          <ArrowForwardIcon />
        </IconButton>{" "}
      </div>)}
    </TableContainer>
    </Box>
  );
}


let lastVisibleDoc = null;
let firstVisibleDoc = null;

// const [searchCriteria, setSearchCritera] = React.useState({})
// Default searchCriteria is empty strings
let searchCriteria = {
  searchUserID: "",
  searchCourseID: "",
};


function FirebaseDataTable(props) {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const componentRef = useRef();
  const [pageNum, setPageNum] = React.useState(1);

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  if (!user) {
    navigate("/login");
  }

  const [data, setData] = React.useState([]);

  const [isFirstPage, setIsFirstPage] = React.useState(null);
  const [isLastPage, setIsLastPage] = React.useState(null);

  const [firstDocEverSortkey, setFirstDocEverSortkey] = React.useState(null);

  const isFirstPageFunc = async (pageZero) => {
    if (!pageZero) {
      setIsFirstPage(true);
    } else {
      var docs = await FirebaseReadQueries({
        type: "isFirstPage",
        collectionName: props.accessor,
        sortKey: props.sortKey,
        firstVisibleDoc: pageZero,
        searchCriteria: searchCriteria,
        // Include some extras if request is coming from attendance page
        isAttendance: props.type === "attendance",
        courseID: props.type === "attendance" && props.pageCourseID,
      });

      // Sets false if page exists, otherwise true
      setIsFirstPage(!docs[0]);
      console.log("First page: ", Boolean(!docs[0]));

      // Don't allow user to go back further than firstDocEverSortkey
      // in case new data was added while user was browsing
      // Only do this for sign-ins
      if (props.accessor === "sign-ins" && pageZero.data().sortKey === firstDocEverSortkey) {
        setIsFirstPage(true);
      }
    }
  };

  const isLastPageFunc = async (pageLast) => {
    // console.log(pageLast);
    if (!pageLast) {
      setIsLastPage(true);
    } else {
      var docs = await FirebaseReadQueries({
        type: "isLastPage",
        collectionName: props.accessor,
        sortKey: props.sortKey,
        lastVisibleDoc: pageLast,
        searchCriteria: searchCriteria,
        // Include some extras if request is coming from attendance page
        isAttendance: props.type === "attendance",
        courseID: props.type === "attendance" && props.pageCourseID,
      });

      // Returns false if page exists, otherwise true
      setIsLastPage(!docs[0]);
      // console.log(documentSnapshots.docs[0]);
      console.log("Last page: ", Boolean(!docs[0]));
    }
  };

  // Handles getting data from firebase
  // Queries contained in TableQueries.js
  const getSigninData = async (getSigninDataType) => {
    // Add check for first/last pages. if "refresh" then use these instead of starting from 0

    console.log("Getting sign in data with type: ", getSigninDataType);
    // console.log(getSigninDataType);
    // console.log(searchCriteria);

    const docs = await FirebaseReadQueries({
      type: props.type, // Specific id for queries
      collectionName: props.accessor,
      getSigninDataType: getSigninDataType, //type of request, e.g. next page, previous page, or refresh
      // daySortKeyLargest: props.daySortKeyLargest, //if defined, then only request past day's data
      sortKey: props.sortKey, //field to sort by
      firstVisibleDoc: firstVisibleDoc, //first doc currently shown in table
      lastVisibleDoc: lastVisibleDoc, //last doc currently shown in table
      courseID: props.pageCourseID,
      //sortKey field in sign-ins collection is based off timestamp, essentially a way
      //to sort by latest data, rather than firebase default of oldest data
      //daySortKeyLargest is passed by Attendance.js, and is the sortKey given by 12am,
      //so any sortKey smaller than this value is within the past day

      // Given by the search component
      searchCriteria: searchCriteria,
    });

    // console.log(docs)
    setData(
      docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    );

    console.log("y\ny\ny\n", data)

    // Update first and last documents after updating page
    lastVisibleDoc = docs[docs.length - 1];
    firstVisibleDoc = docs[0];

    // Set if not already set
    if (!firstDocEverSortkey && firstVisibleDoc) {
      setFirstDocEverSortkey(firstVisibleDoc.data().sortKey);
    }

    // Set states
    await isFirstPageFunc(firstVisibleDoc);
    await isLastPageFunc(lastVisibleDoc);

    // Reset page num
    if (getSigninDataType === "refresh") {
      setPageNum(1)
    }
  };

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  const skipResetRef = React.useRef(false);

  // This function is called when user makes a search
  const makeSearch = (data) => {
    // Update searchCritiera var before querying
    searchCriteria = data;
    // console.log(searchCriteria);

    // Call table refresh with specific search query
    // Same query as before, but with an added "searchCritiera" obj
    getSigninData("refresh");

    // Future next,prev button presses will pass this searchCriteria still
    // Reset on refresh
  };

  React.useEffect(() => {
    getSigninData("refresh");
  }, []);

  return (
    <Fragment>
      <BasicTable 
        rowData={data}
        dataType={props.dataType}
        dataTypeHeader={props.dataTypeHeader}
        skipReset={skipResetRef.current}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        getSigninData={getSigninData}
        isAttendanceInfo={props.type === "attendance-info"}
        // Default style if none specified
        tableStyle={props.tableStyle ? props.tableStyle : "default"}
        tableTitle={props.tableTitle}
        pageNum={pageNum}
        setPageNum={setPageNum}
      />

      {!props.excludeSearch && (<div>
        <h1>Search Data</h1>
        <FirebaseDataTableSearch
          searchType={props.type}
          searchCriteria={makeSearch}
          hasSubmit={true}
        />
      </div>)}
    </Fragment>
  );
}

export default FirebaseDataTable;
