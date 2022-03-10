import React, { Fragment, Component, useState, useEffect, useRef } from "react"

// FirebaseDataTable Functions
import DateBetweenFilter from "./DateBetweenFilter"
import DefaultColumnFilter from "./DefaultColumnFilter"
import FilterGreaterThan from "./FilterGreaterThan"
import SelectColumnFilter from "./SelectColumnFilter"
import DateRangeColumnFilter from "./DateRangeColumnFilter";

// Dependencies for data
import moment from "moment";
import QRCode from "../../Components/QRCode";
import ReactToPrint from "react-to-print";
import PrintQRReport from "../../Components/PrintQRReport";

// Must create header data for each type of table used
// Currently has headers for "sign-ins" and "courses" tables
const TableHeaders = () => {
    return {
        "sign-ins": {
            Header: "Sign In Data",
            columns: [
            {
                Header: "User ID",
                accessor: "userID",
                aggregate: "count",
                Aggregated: ({ value }) => `${value} Names`,
            },
            {
                Header: "Course Name",
                accessor: "courseName",
                filter: "fuzzyText",
                aggregate: "uniqueCount",
                Aggregated: ({ value }) => `${value} Unique Names`,
            },
            {
                Header: "Course ID",
                accessor: "courseID",
                filter: "fuzzyText",
                aggregate: "uniqueCount",
                Aggregated: ({ value }) => `${value} Unique Names`,
            },
            {
                Header: "Date",
                accessor: (d) => {
                return moment(d.timestampLogged.toDate())
                    .local()
                    .format("MM-DD-YYYY hh:mm:ss a");
                },
                Filter: DateRangeColumnFilter,
                filter: "dateBetween",
                aggregate: "sum",
                Aggregated: ({ value }) => `${value} (total)`,
            },
            {
                Header: "Archival Status",
                accessor: (d) => {
                return d.isArchived ? "True" : "False";
                },
                Filter: SelectColumnFilter,
                filter: "includes",
            },
            ],
        },
    
        "courses": {
            Header: "Course Data",
            columns: [
            {
                Header: "Course Name",
                accessor: "courseName",
                filter: "fuzzyText",
                aggregate: "uniqueCount",
                Aggregated: ({ value }) => `${value} Unique Names`,
            },
            {
                Header: "Course ID",
                accessor: "courseID",
                filter: "fuzzyText",
                aggregate: "uniqueCount",
                Aggregated: ({ value }) => `${value} Unique Names`,
            },
            {
                Header: "Attendance Sheet",
                accessor: (d) => {
                    return (<a
                        href={"/courses/" + d.courseID + "/attendance"}
                        rel="noreferrer"
                    >
                        Link
                    </a>)
                },
                filter: "fuzzyText",
                aggregate: "uniqueCount",
                Aggregated: ({ value }) => `${value} Unique Names`,
            },
            {
                Header: "QR Code",
                accessor: (d) => {
                    return (
                        <Fragment>
                            <QRCode value={d.courseID.toString()} />

                            {/* Pass props to this component, which handles
                            the ReactToPrint and QrPrint references */}
                            <PrintQRReport 
                            value={d.courseID.toString()}
                            coursename={d.courseName}
                            />
                        </Fragment>
                    )
                },
                filter: "fuzzyText",
                aggregate: "uniqueCount",
                Aggregated: ({ value }) => `${value} Unique Names`,
            },
            {
                Header: "Time Created",
                accessor: (d) => {
                    return moment(d.timeCreated.toDate())
                        .local()
                        .format("MM-DD-YYYY hh:mm:ss a");
                },
                Filter: DateRangeColumnFilter,
                filter: "dateBetween",
                aggregate: "sum",
                Aggregated: ({ value }) => `${value} (total)`,
            },
            ],
        }
    }
}

export default TableHeaders