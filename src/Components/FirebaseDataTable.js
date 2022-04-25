import React, { Fragment } from "react";
import styled from "styled-components";
import { useTable } from "react-table";
import { getDocs } from "firebase/firestore";
import { auth } from "../firebase-config";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { IconButton } from "@mui/material";

import { useState, useRef } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

// FirebaseDataTable Table Data
import TableHeaders from "../Functions/TableHeaders";

// DB Queries
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";

import FirebaseDataTableSearch from "./FirebaseDataTableSearch";

const Styles = styled.div`
  padding: 1rem;
  grid-row: 1 / 8;
  // outline: auto;
  display: flex;
  flex-direction: column;
  align-items: center;

  table {
    border-spacing: 0;
    border: 1px solid black;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;
      border-bottom: 1px solid black;
      border-right: 1px solid black;

      :last-child {
        border-right: 0;
      }
    }

    td {
      input {
        font-size: 1rem;
        padding: 0;
        margin: 0;
        border: 0;
      }
    }
  }

  .pagination {
    padding: 0.5rem;
  }
`;

function Table({ columns, data, isFirstPage, isLastPage, getSigninData, isAttendanceInfo }) {
  // Use the state and functions returned from useTable to build your UI
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  const [isNextDisabled, setIsNextDisabled] = React.useState();
  const [isPreviousDisabled, setIsPreviousDisabled] = React.useState();
  const [pageNum, setPageNum] = React.useState(1);

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Dont show paging for attendance info table */}
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

    </>
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
      <Styles>
        <Table
          columns={columns}
          data={data}
          skipReset={skipResetRef.current}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          getSigninData={getSigninData}
          minRows={0}
          isAttendanceInfo={props.type === "attendanceInfo"}
        />
      </Styles>

      {!props.excludeSearch && (
        <FirebaseDataTableSearch
          searchType={props.type}
          searchCriteria={makeSearch}
          hasSubmit={true}
        />
      )}
    </Fragment>
  );
}

export default FirebaseDataTable;
