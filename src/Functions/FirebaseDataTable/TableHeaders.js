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
import { QrPrint } from "../../Components/QrPrint";
import PrintQRReport from "../../Components/PrintQRReport";

// Must create header data for each type of table used
// const TableHeaders = () => {
//     const componentRef = useRef(null);

//     return (
//         {
//             "sign-ins": {
//                 Header: "Sign In Data",
//                 columns: [
//                 {
//                     Header: "User ID",
//                     accessor: "userID",
//                     aggregate: "count",
//                     Aggregated: ({ value }) => `${value} Names`,
//                 },
//                 {
//                     Header: "Course Name",
//                     accessor: "courseName",
//                     filter: "fuzzyText",
//                     aggregate: "uniqueCount",
//                     Aggregated: ({ value }) => `${value} Unique Names`,
//                 },
//                 {
//                     Header: "Course ID",
//                     accessor: "courseID",
//                     filter: "fuzzyText",
//                     aggregate: "uniqueCount",
//                     Aggregated: ({ value }) => `${value} Unique Names`,
//                 },
//                 {
//                     Header: "Date",
//                     accessor: (d) => {
//                     return moment(d.timestampLogged.toDate())
//                         .local()
//                         .format("MM-DD-YYYY hh:mm:ss a");
//                     },
//                     Filter: DateRangeColumnFilter,
//                     filter: "dateBetween",
//                     aggregate: "sum",
//                     Aggregated: ({ value }) => `${value} (total)`,
//                 },
//                 {
//                     Header: "Archival Status",
//                     accessor: (d) => {
//                     return d.isArchived ? "True" : "False";
//                     },
//                     Filter: SelectColumnFilter,
//                     filter: "includes",
//                 },
//                 ],
//             },
        
//             "courses": {
//                 Header: "Course Data",
//                 columns: [
//                 {
//                     Header: "Course Name",
//                     accessor: "courseName",
//                     filter: "fuzzyText",
//                     aggregate: "uniqueCount",
//                     Aggregated: ({ value }) => `${value} Unique Names`,
//                 },
//                 {
//                     Header: "Course ID",
//                     accessor: "courseID",
//                     filter: "fuzzyText",
//                     aggregate: "uniqueCount",
//                     Aggregated: ({ value }) => `${value} Unique Names`,
//                 },
//                 {
//                     Header: "Attendance Sheet",
//                     accessor: (d) => {
//                         return (<a
//                             href={"/courses/" + d.courseID + "/attendance"}
//                             rel="noreferrer"
//                         >
//                             Link
//                         </a>)
//                     },
//                     filter: "fuzzyText",
//                     aggregate: "uniqueCount",
//                     Aggregated: ({ value }) => `${value} Unique Names`,
//                 },
//                 {
//                     Header: "QR Code",
//                     accessor: (d) => {
//                         return (
//                             <Fragment>
//                                 <QRCode value={d.courseID.toString()} />
        
//                                 {/* Print Button */}
//                                 {/* https://github.com/gregnb/react-to-print/issues/83 */}
//                                 {/* https://github.com/gregnb/react-to-print/issues/323#issuecomment-986947323 */}
//                                 <ReactToPrint
//                                 trigger={() => <button>Print</button>}
//                                 content={() => this.componentRef}
//                                 />
        
//                                 {/* Content to print, hidden with display: none */}
//                                 {/* <QrPrint
//                                 value={d.courseID.toString()}
//                                 coursename={d.courseName}
//                                 ref={(el) => (qrPrintRefs.current[i] = el)}
//                                 /> */}
//                                 <QrPrint
//                                 value={d.courseID.toString()}
//                                 coursename={d.courseName}
//                                 propsRef={el => (this.componentRef = el)}
//                                 />
//                             </Fragment>
//                         )
//                     },
//                     filter: "fuzzyText",
//                     aggregate: "uniqueCount",
//                     Aggregated: ({ value }) => `${value} Unique Names`,
//                 },
//                 {
//                     Header: "Time Created",
//                     accessor: (d) => {
//                         return moment(d.timeCreated.toDate())
//                             .local()
//                             .format("MM-DD-YYYY hh:mm:ss a");
//                     },
//                     Filter: DateRangeColumnFilter,
//                     filter: "dateBetween",
//                     aggregate: "sum",
//                     Aggregated: ({ value }) => `${value} (total)`,
//                 },
//                 ],
//             }
//         }
//     )
// }

// export default TableHeaders















// export const tableData = {
//     "sign-ins": {
//         Header: "Sign In Data",
//         columns: [
//         {
//             Header: "User ID",
//             accessor: "userID",
//             aggregate: "count",
//             Aggregated: ({ value }) => `${value} Names`,
//         },
//         {
//             Header: "Course Name",
//             accessor: "courseName",
//             filter: "fuzzyText",
//             aggregate: "uniqueCount",
//             Aggregated: ({ value }) => `${value} Unique Names`,
//         },
//         {
//             Header: "Course ID",
//             accessor: "courseID",
//             filter: "fuzzyText",
//             aggregate: "uniqueCount",
//             Aggregated: ({ value }) => `${value} Unique Names`,
//         },
//         {
//             Header: "Date",
//             accessor: (d) => {
//             return moment(d.timestampLogged.toDate())
//                 .local()
//                 .format("MM-DD-YYYY hh:mm:ss a");
//             },
//             Filter: DateRangeColumnFilter,
//             filter: "dateBetween",
//             aggregate: "sum",
//             Aggregated: ({ value }) => `${value} (total)`,
//         },
//         {
//             Header: "Archival Status",
//             accessor: (d) => {
//             return d.isArchived ? "True" : "False";
//             },
//             Filter: SelectColumnFilter,
//             filter: "includes",
//         },
//         ],
//     },

//     "courses": {
//         Header: "Course Data",
//         columns: [
//         {
//             Header: "Course Name",
//             accessor: "courseName",
//             filter: "fuzzyText",
//             aggregate: "uniqueCount",
//             Aggregated: ({ value }) => `${value} Unique Names`,
//         },
//         {
//             Header: "Course ID",
//             accessor: "courseID",
//             filter: "fuzzyText",
//             aggregate: "uniqueCount",
//             Aggregated: ({ value }) => `${value} Unique Names`,
//         },
//         {
//             Header: "Attendance Sheet",
//             accessor: (d) => {
//                 return (<a
//                     href={"/courses/" + d.courseID + "/attendance"}
//                     rel="noreferrer"
//                 >
//                     Link
//                 </a>)
//             },
//             filter: "fuzzyText",
//             aggregate: "uniqueCount",
//             Aggregated: ({ value }) => `${value} Unique Names`,
//         },
//         {
//             Header: "QR Code",
//             accessor: (d) => {
//                 return (
//                     <Fragment>
//                         <QRCode value={d.courseID.toString()} />

//                         {/* Print Button */}
//                         {/* https://github.com/gregnb/react-to-print/issues/83 */}
//                         {/* https://github.com/gregnb/react-to-print/issues/323#issuecomment-986947323 */}
//                         <ReactToPrint
//                         trigger={() => <button>Print</button>}
//                         content={() => this.componentRef}
//                         />

//                         {/* Content to print, hidden with display: none */}
//                         {/* <QrPrint
//                         value={d.courseID.toString()}
//                         coursename={d.courseName}
//                         ref={(el) => (qrPrintRefs.current[i] = el)}
//                         /> */}
//                         <QrPrint
//                         value={d.courseID.toString()}
//                         coursename={d.courseName}
//                         propsRef={el => (this.componentRef = el)}
//                         />
//                     </Fragment>
//                 )
//             },
//             filter: "fuzzyText",
//             aggregate: "uniqueCount",
//             Aggregated: ({ value }) => `${value} Unique Names`,
//         },
//         {
//             Header: "Time Created",
//             accessor: (d) => {
//                 return moment(d.timeCreated.toDate())
//                     .local()
//                     .format("MM-DD-YYYY hh:mm:ss a");
//             },
//             Filter: DateRangeColumnFilter,
//             filter: "dateBetween",
//             aggregate: "sum",
//             Aggregated: ({ value }) => `${value} (total)`,
//         },
//         ],
//     }
// }

// export default tableData










const TableHeaders = () => {
    // const componentRef = useRef(null)

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
                        // <Fragment>
                        //     <QRCode value={d.courseID.toString()} />
    
                        //     {/* Print Button */}
                        //     {/* https://github.com/gregnb/react-to-print/issues/83 */}
                        //     {/* https://github.com/gregnb/react-to-print/issues/323#issuecomment-986947323 */}
                        //     <ReactToPrint
                        //     trigger={() => <button>Print</button>}
                        //     content={() => componentRef.current}
                        //     />
    
                        //     {/* Content to print, hidden with display: none */}
                        //     {/* <QrPrint
                        //     value={d.courseID.toString()}
                        //     coursename={d.courseName}
                        //     ref={(el) => (qrPrintRefs.current[i] = el)}
                        //     /> */}
                        //     <QrPrint
                        //     value={d.courseID.toString()}
                        //     coursename={d.courseName}
                        //     propsRef={componentRef}
                        //     />
                        // </Fragment>
                        <Fragment>
                            <QRCode value={d.courseID.toString()} />
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