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

function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [(row) => row.values[id]] });
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = (val) => !val;

DateBetweenFilter.autoRemove = (val) => !val;

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
FilterGreaterThan.autoRemove = (val) => typeof val !== "number";

// Be sure to pass our updateMyData and the skipReset option
function Table({
  columns,
  data,
  updateMyData,
  skipReset,
  isFirstPage,
  isLastPage,
  getSigninData,
}) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      dateBetween: DateBetweenFilter,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      // And also our default editable cell
      //   Cell: EditableCell,
    }),
    []
  );

  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', we'll use page,
    // which has only the rows for the active page

    // The rest of these things are super handy, too ;)
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    // nextPage,
    // previousPage,
    setPageSize,
    state: { pageIndex, pageSize, sortBy, expanded, filters, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      // updateMyData isn't part of the API, but
      // anything we put into these options will
      // automatically be available on the instance.
      // That way we can call this function from our
      // cell renderer!
      updateMyData,
      // We also need to pass this so the page doesn't change
      // when we edit the data.
      autoResetPage: !skipReset,
      autoResetSelectedRows: !skipReset,
      disableMultiSort: true,
      isFirstPage: true,
      isLastPage: false,
    },
    useFilters,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    // Here we will use a plugin to add our selection column
    (hooks) => {
      hooks.visibleColumns.push((columns) => {
        return [
          {
            id: "selection",
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ];
      });
    }
  );

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
                <th {...column.getHeaderProps()}>
                  <div>
                    <span {...column.getSortByToggleProps()}>
                      {column.render("Header")}
                      {/* Add a sort direction indicator */}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </div>
                  {/* Render the columns filter UI */}
                  {/* <div>{column.canFilter ? column.render("Filter") : null}</div> */}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? "👇" : "👉"}
                          </span>{" "}
                          {cell.render("Cell", { editable: false })} (
                          {row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render("Aggregated")
                      ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        cell.render("Cell", { editable: true })
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        {/* <button onClick={() => previousPage()} disabled={isFirstPage}> */}
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
          Page{" "}
          <strong>
            {pageNum}
          </strong>{" "}
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
      </div>
      {/* Shows states below table */}
      {/* <pre>
        <code>
          {JSON.stringify(
            {
              pageIndex,
              pageSize,
              pageCount,
              canNextPage,
              canPreviousPage,
              sortBy,
              expanded: expanded,
              filters,
              selectedRowIds: selectedRowIds,
              isFirstPage,
              isLastPage,
            },
            null,
            2
          )}
        </code>
      </pre> */}
    </>
  );
}

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);

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

  const [firstDocEverSortkey, setFirstDocEverSortkey] = React.useState(null)

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

    const data = await FirebaseReadQueries({
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
    console.log(data)
    console.log(await getDocs(data))

    // Update page
    const documentSnapshots = await getDocs(data);

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
    console.log("First doc: ", firstVisibleDoc.data().userID)
    console.log("Last doc: ", lastVisibleDoc.data().userID)

    // Set states
    await isFirstPageFunc(firstVisibleDoc);
    await isLastPageFunc(lastVisibleDoc);

    console.log("\n")
  };

  const [originalData] = React.useState(data);

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  const skipResetRef = React.useRef(false);

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    skipResetRef.current = true;
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          };
        }
        return row;
      })
    );
  };

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
          // updateMyData={updateMyData}
          skipReset={skipResetRef.current}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          getSigninData={getSigninData}
          minRows={0}
        />
      </Styles>

      {!props.excludeSearch &&
      <FirebaseDataTableSearch
        searchType={props.type}
        searchCriteria={makeSearch}
        hasSubmit={true}
      />
      }
    </Fragment>
  );
}

export default FirebaseDataTable;
