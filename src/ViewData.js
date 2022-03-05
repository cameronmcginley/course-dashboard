import React from 'react'
import styled from 'styled-components'
import {
  useTable,
  usePagination,
  useSortBy,
  useFilters,
  useExpanded,
  useRowSelect,
} from 'react-table'
import { matchSorter } from 'match-sorter'
import moment from 'moment'
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
    setState
} from "firebase/firestore";
import { db } from "./firebase-config";

import makeData from './makeData'
import DateRangeColumnFilter from './DateRangeColumnFilter'

import { CSVLink, CSVDownload } from "react-csv";
import AsyncCSV from './AsyncCSV';

const Styles = styled.div`
  padding: 1rem;

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
`

// Define a default UI for filtering
function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length

  return (
    <input
      value={filterValue || ''}
      onChange={e => {
        setFilter(e.target.value || undefined) // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  )
}

// This is a custom filter UI for selecting
// a unique option from a list
function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set()
    preFilteredRows.forEach(row => {
      options.add(row.values[id])
    })
    return [...options.values()]
  }, [id, preFilteredRows])

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={e => {
        setFilter(e.target.value || undefined)
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}


function fuzzyTextFilterFn(rows, id, filterValue) {
  return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

// Let the table remove the filter if the string is empty
fuzzyTextFilterFn.autoRemove = val => !val

// Custom date between filter
function dateBetweenFilterFn(rows, id, filterValues) {
    const sd = filterValues[0] ? new Date(filterValues[0]) : undefined
    const ed = filterValues[1] ? new Date(filterValues[1]) : undefined

    if (ed || sd) {
      return rows.filter(r => {
        const cellDate = new Date(r.values[id])

        if (ed && sd) {
          return cellDate >= sd && cellDate <= ed
        } else if (sd){
          return cellDate >= sd
        } else if (ed){
          return cellDate <= ed
        }
      })
    } else {
      return rows
    }
  }

dateBetweenFilterFn.autoRemove = val => !val;

// Be sure to pass our updateMyData and the skipReset option
function Table({ columns, data, updateMyData, skipReset, isFirstPage, isLastPage, getSigninData }) {
  const filterTypes = React.useMemo(
    () => ({
      // Add a new fuzzyTextFilterFn filter type.
      fuzzyText: fuzzyTextFilterFn,
      dateBetween: dateBetweenFilterFn,
      // Or, override the default text filter to use
      // "startWith"
      text: (rows, id, filterValue) => {
        return rows.filter(row => {
          const rowValue = row.values[id]
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true
        })
      },
    }),
    []
  )

  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
      // And also our default editable cell
    //   Cell: EditableCell,
    }),
    []
  )

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
    state: {
      pageIndex,
      pageSize,
      sortBy,
      expanded,
      filters,
      selectedRowIds,
    },
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
    hooks => {
      hooks.visibleColumns.push(columns => {
        return [
          {
            id: 'selection',
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
        ]
      })
    }
  )

  const [isNextDisabled, setIsNextDisabled] = React.useState();
  const [isPreviousDisabled, setIsPreviousDisabled] = React.useState();

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
                  <div>
                    <span {...column.getSortByToggleProps()}>
                      {column.render('Header')}
                      {/* Add a sort direction indicator */}
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                  </div>
                  {/* Render the columns filter UI */}
                  <div>{column.canFilter ? column.render('Filter') : null}</div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.isGrouped ? (
                        // If it's a grouped cell, add an expander and row count
                        <>
                          <span {...row.getToggleRowExpandedProps()}>
                            {row.isExpanded ? '👇' : '👉'}
                          </span>{' '}
                          {cell.render('Cell', { editable: false })} (
                          {row.subRows.length})
                        </>
                      ) : cell.isAggregated ? (
                        // If the cell is aggregated, use the Aggregated
                        // renderer for cell
                        cell.render('Aggregated')
                      ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                        // Otherwise, just render the regular cell
                        cell.render('Cell', { editable: true })
                      )}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      {/*
        Pagination can be built however you'd like.
        This is just a very basic UI implementation:
      */}
      <div className="pagination">
        {/* <button onClick={() => previousPage()} disabled={isFirstPage}> */}
        <button 
            onClick={() => {
                setIsPreviousDisabled(true);
                setTimeout(() => {
                  setIsPreviousDisabled(false);
                }, 200)
                getSigninData("previous");
            }} 
            // Disabled based on click delay, or if its first page (the timeout would re-enable even if first page)
            disabled={isPreviousDisabled || isFirstPage}> 
          {'<'}
        </button>{' '}
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <button
          onClick={() => {
                setIsNextDisabled(true);
                setTimeout(() => {
                  setIsNextDisabled(false);
                }, 200)
                getSigninData("next");
            }} 
            disabled={isNextDisabled || isLastPage}>
          {'>'}
        </button>{' '}
        {/* <span>
          | Go to page:{' '}
          <input
            type="number"
            defaultValue={pageIndex + 1}
            onChange={e => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            style={{ width: '100px' }}
          />
        </span>{' '} */}
        {/* <select
          value={pageSize}
          onChange={e => {
            setPageSize(Number(e.target.value))
          }}
        >
          {[10, 20, 30, 40, 50].map(pageSize => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select> */}
      </div>
      <pre>
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
      </pre>
    </>
  )
}

// Define a custom filter filter function!
function filterGreaterThan(rows, id, filterValue) {
  return rows.filter(row => {
    const rowValue = row.values[id]
    return rowValue >= filterValue
  })
}

// This is an autoRemove method on the filter function that
// when given the new filter value and returns true, the filter
// will be automatically removed. Normally this is just an undefined
// check, but here, we want to remove the filter if it's not a number
filterGreaterThan.autoRemove = val => typeof val !== 'number'


const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    )
  }
)

let lastVisibleDoc = null
let firstVisibleDoc = null

function ViewData() {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Sign In Data',
        columns: [
          {
            Header: 'User ID',
            accessor: 'userID',
            // Use a two-stage aggregator here to first
            // count the total rows being aggregated,
            // then sum any of those counts if they are
            // aggregated further
            aggregate: 'count',
            Aggregated: ({ value }) => `${value} Names`,
          },
          {
            Header: 'Course Name',
            accessor: 'courseName',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText',
            // Use another two-stage aggregator here to
            // first count the UNIQUE values from the rows
            // being aggregated, then sum those counts if
            // they are aggregated further
            aggregate: 'uniqueCount',
            Aggregated: ({ value }) => `${value} Unique Names`,
          },
          {
            Header: 'Course ID',
            accessor: 'courseID',
            // Use our custom `fuzzyText` filter on this column
            filter: 'fuzzyText',
            // Use another two-stage aggregator here to
            // first count the UNIQUE values from the rows
            // being aggregated, then sum those counts if
            // they are aggregated further
            aggregate: 'uniqueCount',
            Aggregated: ({ value }) => `${value} Unique Names`,
          },
          {
            Header: 'Date',
            // accessor: d => {
            //     console.log(d.timestampLogged)
            //     return moment(d.timestampLogged)
            //       .local()
            //       .format("MM-DD-YYYY hh:mm:ss a")
            //   },
            accessor: d => {
                // console.log(d.timestampLogged)
                return moment(d.timestampLogged.toDate())
                  .local()
                  .format("MM-DD-YYYY hh:mm:ss a")
              },
            Filter: DateRangeColumnFilter,
            filter: 'dateBetween',
            // Aggregate the sum of all visits
            aggregate: 'sum',
            Aggregated: ({ value }) => `${value} (total)`,
          },
          {
            Header: 'Archival Status',
            accessor: d => {
              // console.log(d.isArchived)
              return d.isArchived ? "True" : "False"
            },
            Filter: SelectColumnFilter,
            filter: 'includes',
          }
        ],
      },
    ],
    []
  )




    const [data, setData] = React.useState([]);










    const [isFirstPage, setIsFirstPage] = React.useState(null);
    const [isLastPage, setIsLastPage] = React.useState(null);

    const isFirstPageFunc = async (pageZero) => {
        var data = query(collection(db, "sign-ins"), orderBy("sortKey"), endBefore(pageZero), limit(1));
        const documentSnapshots = await getDocs(data);

        // Returns false if page exists, otherwise true
        setIsFirstPage(!documentSnapshots.docs[0])
    }

    const isLastPageFunc = async (pageLast) => {
        var data = query(collection(db, "sign-ins"), orderBy("sortKey"), startAfter(pageLast), limit(1));
        const documentSnapshots = await getDocs(data);

        // Returns false if page exists, otherwise true
        setIsLastPage(!documentSnapshots.docs[0])
    }

    const getSigninData = async (getSigninDataType) => {
        console.log("Getting sign in data with type:")
        console.log(getSigninDataType)

        // Collect docs based on type of get
        if (getSigninDataType === "refresh") {
            var data = query(collection(db, "sign-ins"), orderBy("sortKey"), startAt(firstVisibleDoc), limit(10));
        }
        else if (getSigninDataType === "previous" && !isFirstPage) {
            // Do nothing if first page
            if (isFirstPage) {
                console.log(isFirstPage)
                console.log("Already first page");
                return}
            var data = query(collection(db, "sign-ins"), orderBy("sortKey"), endBefore(firstVisibleDoc), limitToLast(11));
        }
        else if (getSigninDataType === "next" && !isLastPage) {
            // Use the value to check if last page
            if (isLastPage) {
                console.log(isLastPage)
                console.log("Already last page");
                return}
            var data = query(collection(db, "sign-ins"), orderBy("sortKey"), startAfter(lastVisibleDoc), limit(10));
        }
        else {
          console.log("No query made")
          return
        }
        // Update page
        const documentSnapshots = await getDocs(data);
        setData(documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id })));

        // Update first and last documents after updating page
        lastVisibleDoc = documentSnapshots.docs[documentSnapshots.docs.length-1];
        firstVisibleDoc = documentSnapshots.docs[0];

        // Set states
        await isFirstPageFunc(firstVisibleDoc)
        await isLastPageFunc(lastVisibleDoc)
    }

    // const getSigninData = async () => {
    //     var data = query(collection(db, "sign-ins"));
    //     const documentSnapshots = await getDocs(data);
    //     setData(documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    // }












  const [originalData] = React.useState(data)

  // We need to keep the table from resetting the pageIndex when we
  // Update data. So we can keep track of that flag with a ref.
  const skipResetRef = React.useRef(false)

  // When our cell renderer calls updateMyData, we'll use
  // the rowIndex, columnId and new value to update the
  // original data
  const updateMyData = (rowIndex, columnId, value) => {
    // We also turn on the flag to not reset the page
    skipResetRef.current = true
    setData(old =>
      old.map((row, index) => {
        if (index === rowIndex) {
          return {
            ...row,
            [columnId]: value,
          }
        }
        return row
      })
    )
  }

  // After data changes, we turn the flag back off
  // so that if data actually changes when we're not
  // editing it, the page is reset
  React.useEffect(() => {
    skipResetRef.current = false;
    getSigninData("refresh");
  }, [])

  // Let's add a data resetter/randomizer to help
  // illustrate that flow...
  const resetData = () => {
    // Don't reset the page when we do this
    skipResetRef.current = true
    setData(originalData)
  }

  // this.state = {csvData: []}
  const [csvData, setCsvData] = React.useState([])
  const csvReport = async () => {
    // Don't reset the page when we do this
    console.log("Generating CSV report with all data")

    var data = query(collection(db, "sign-ins"), orderBy("sortKey"), startAt(firstVisibleDoc), limit(10));
    const documentSnapshots = await getDocs(data);

    // console.log((documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))

    setCsvData(documentSnapshots.docs.map((doc) => ({ 
      // ...
      ...doc.data()
      // doc.data()
    })))
    console.log(csvData)


    // setTimeout(function () {
    //   console.log("testtt")
    //   return(csvData)
    // }, 2000)
    // return(csvData)
    // return (documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
  }

  return (
    <Styles>
      {/* <button onClick={csvReport}>Generate CSV Report</button> */}
      {/* <CSVLink 
        data={csvData}
        // asyncOnClick={true}
        // onClick={async () => {
        //   await csvReport()
        //   // setTimeout(function () {
        //   //   console.log("testtt")
        //   // }, 2000)}}
        // }}
        onClick={csvReport}
        >Generate CSV Report
      </CSVLink>; */}

      <AsyncCSV />


      <Table
        columns={columns}
        data={data}
        // updateMyData={updateMyData}
        skipReset={skipResetRef.current}
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        getSigninData={getSigninData}
      />
    </Styles>
  )
}

export default ViewData
