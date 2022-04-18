
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';


// Dependencies for data
import QRCode from "./QRCode";
import ReactToPrint from "react-to-print";
import PrintQRReport from "./PrintQRReport";


import React, { Fragment } from "react";
import styled from "styled-components";
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useExpanded,
  useRowSelect,
} from "react-table";
import { matchSorter } from "match-sorter";
import moment from "moment";
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
  onSnapshot,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';

import makeData from "../Functions/makeData";

import { CSVLink, CSVDownload } from "react-csv";
import DialogHandler from "./DialogBox/DialogHandler";

import { useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// FirebaseDataTable Functions
import DateBetweenFilter from "../Functions/FirebaseDataTable/DateBetweenFilter";
import DefaultColumnFilter from "../Functions/FirebaseDataTable/DefaultColumnFilter";
import FilterGreaterThan from "../Functions/FirebaseDataTable/FilterGreaterThan";
import SelectColumnFilter from "../Functions/FirebaseDataTable/SelectColumnFilter";
import DateRangeColumnFilter from "../Functions/FirebaseDataTable/DateRangeColumnFilter";

// FirebaseDataTable Table Data
import TableHeaders from "../Functions/FirebaseDataTable/TableHeaders";

// DB Queries
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";

import FirebaseDataTableSearch from "./FirebaseDataTableSearch";




function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];














let lastVisibleDoc = null;
let firstVisibleDoc = null;

// const [searchCriteria, setSearchCritera] = React.useState({})
// Default searchCriteria is empty strings
let searchCriteria = {
  searchUserID: "",
  searchCourseID: "",
};




export default function BasicTable(props) {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const componentRef = useRef();
  
    onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
  
    if (!user) {
      navigate("/login");
    }
  
    const columns = React.useMemo(() => [TableHeaders(props)[props.type]], []);
    const [data, setData] = React.useState([]);
    const [isFirstPage, setIsFirstPage] = React.useState(null);
    const [isLastPage, setIsLastPage] = React.useState(null);
    const [firstDocEverSortkey, setFirstDocEverSortkey] = React.useState(null)
    const [originalData] = React.useState(data);

    const isFirstPageFunc = async (pageZero) => {
      if (!pageZero) {
        setIsFirstPage(true);
      } else {
        var data = await FirebaseReadQueries({
          type: "isFirstPage",
          collectionName: props.accessor,
          sortKey: props.sortKey,
          firstVisibleDoc: pageZero,
          searchCriteria: searchCriteria,
          // Include some extras if request is coming from attendance page
          isAttendance: (props.type === "attendance"),
          courseID: (props.type === "attendance") && props.pageCourseID,
        });
  
        const documentSnapshots = await getDocs(data);
  
        // Sets false if page exists, otherwise true
        setIsFirstPage(!documentSnapshots.docs[0]);
        console.log("First page: ", Boolean(!documentSnapshots.docs[0]))
  
        // Don't allow user to go back further than firstDocEverSortkey
        // in case new data was added while user was browsing
        if (pageZero.data().sortKey === firstDocEverSortkey) {
          setIsFirstPage(true)
        }
      }
    };
  
    const isLastPageFunc = async (pageLast) => {
      // console.log(pageLast);
      if (!pageLast) {
        setIsLastPage(true);
      } else {
        var data = await FirebaseReadQueries({
          type: "isLastPage",
          collectionName: props.accessor,
          sortKey: props.sortKey,
          lastVisibleDoc: pageLast,
          searchCriteria: searchCriteria,
          // Include some extras if request is coming from attendance page
          isAttendance: (props.type === "attendance"),
          courseID: (props.type === "attendance") && props.pageCourseID,
        });
  
        const documentSnapshots = await getDocs(data);
  
        // Returns false if page exists, otherwise true
        setIsLastPage(!documentSnapshots.docs[0]);
        // console.log(documentSnapshots.docs[0]);
        console.log("Last page: ", Boolean(!documentSnapshots.docs[0]))
      }
    };
  
    // Handles getting data from firebase
    // Queries contained in TableQueries.js
    const getSigninData = async (getSigninDataType) => {
      // Add check for first/last pages. if "refresh" then use these instead of starting from 0
  
      console.log("Getting sign in data with type: ", getSigninDataType);
      // console.log(getSigninDataType);
      // console.log(searchCriteria);
  
      const fbdata = await FirebaseReadQueries({
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
  
      // console.log("TEST", data)
      console.log("1")
      console.log(fbdata)
      console.log(await getDocs(fbdata))
  
      // Update page
      const documentSnapshots = await getDocs(fbdata);
  
      // console.log(documentSnapshots)
      console.log("2")
      console.log(documentSnapshots)
  
      setData(
        documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
  
      console.log("3")
  
      // Update first and last documents after updating page
      lastVisibleDoc = documentSnapshots.docs[documentSnapshots.docs.length - 1];
      firstVisibleDoc = documentSnapshots.docs[0];
  
      // Set if not already set
      if (!firstDocEverSortkey) {
        console.log(firstDocEverSortkey)
        setFirstDocEverSortkey(firstVisibleDoc.data().sortKey)
      }
  
      console.log("4")
      // console.log("First doc: ", firstVisibleDoc.data().userID)
      // console.log("Last doc: ", lastVisibleDoc.data().userID)
  
      // Set states
      await isFirstPageFunc(firstVisibleDoc);
      await isLastPageFunc(lastVisibleDoc);
  
      console.log("\n")
      console.log("y\ny\ny\n", documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
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
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Course Name</TableCell>
            <TableCell align="center">Course ID</TableCell>
            <TableCell align="center">Attendance Sheet</TableCell>
            <TableCell align="center">QR Code</TableCell>
            <TableCell align="center">Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">{row.carbs}</TableCell>
              <TableCell align="right">{row.protein}</TableCell>
            </TableRow>
          ))} */}
          {data.map((d) => (
            <TableRow
              key={d.courseID}
            //   sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {d.courseName}
              </TableCell>

              <TableCell align="center">{d.courseID}</TableCell>

              <TableCell align="center">{
                <a
                    href={"/courses/" + d.courseID + "/attendance"}
                    rel="noreferrer"
                >
                    Link
                </a>}
              </TableCell>

              <TableCell align="center">{
                <Fragment>
                    <QRCode value={d.courseFullStr.toString()} />

                    {/* Pass props to this component, which handles
                    the ReactToPrint and QRReport references */}
                    <PrintQRReport value={d.courseFullStr.toString()} />
                </Fragment>
              }</TableCell>

              <TableCell align="center">{
                    moment(d.timeCreated.toDate())
                    .local()
                    .format("MM-DD-YYYY hh:mm:ss a")
              }</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
