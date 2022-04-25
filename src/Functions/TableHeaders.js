import React, { Fragment } from "react";

// Dependencies for data
import moment from "moment";
import QRCode from "../Components/QRCode";
import PrintQRReport from "../Components/PrintQRReport";

// Must create header data for each type of table used
const TableHeaders = (props) => {
  return {
    attendance: {
      collection: "sign-ins",
      Header: "Signed In Today",
      columns: [
        {
          Header: "User ID",
          accessor: (d) => {
            return d.userID;
          },
        },
      ],
    },

    "sign-ins": {
      collection: "sign-ins",
      Header: "Sign In Data",
      columns: [
        {
          Header: "User ID",
          accessor: "userID",
        },
        {
          Header: "Course Name",
          accessor: "courseName",
        },
        {
          Header: "Course ID",
          accessor: "courseID",
        },
        {
          Header: "Date",
          accessor: (d) => {
            return moment(d.timestampLogged.toDate())
              .local()
              .format("MM-DD-YYYY hh:mm:ss a");
          },
        },
        {
          Header: "Archival Status",
          accessor: (d) => {
            return d.isArchived ? "True" : "False";
          },
        },
      ],
    },

    courses: {
      collection: "courses",
      Header: "Course Data",
      columns: [
        {
          Header: "Course Name",
          accessor: "courseName",
        },
        {
          Header: "Course ID",
          accessor: "courseID",
        },
        {
          Header: "Attendance Sheet",
          accessor: (d) => {
            return (
              <a
                href={"/courses/" + d.courseID + "/attendance"}
                rel="noreferrer"
              >
                Link
              </a>
            );
          },
        },
        {
          Header: "QR Code",
          accessor: (d) => {
            return (
              <Fragment>
                <QRCode value={d.courseFullStr.toString()} />

                {/* Pass props to this component, which handles
                            the ReactToPrint and QRReport references */}
                <PrintQRReport value={d.courseFullStr.toString()} />
              </Fragment>
            );
          },
        },
        {
          Header: "Course Instructor(s)",
          accessor: "courseInstructor",
        },
        // {
        //   Header: "Time Created",
        //   accessor: (d) => {
        //     return moment(d.timeCreated.toDate())
        //       .local()
        //       .format("MM-DD-YYYY hh:mm:ss a");
        //   },
        // },
      ],
    },


    attendanceInfo: {
      collection: "courses",
      Header: "Course Data",
      columns: [
        {
          Header: "Course Name",
          accessor: "courseName",
        },
        {
          Header: "Course ID",
          accessor: "courseID",
        },
        {
          Header: "Course Instructor(s)",
          accessor: "courseInstructor",
        },
        {
          Header: "Sponsor Agency",
          accessor: "sponsorAgency",
        },
        {
          Header: "Instructor Agency",
          accessor: "instructorAgency",
        },
        {
          Header: "Coordinator",
          accessor: "coordinator",
        },
        {
          Header: "Synopsis",
          accessor: "synopsis",
        },
        // {
        //   Header: "Time Created",
        //   accessor: (d) => {
        //     return moment(d.timeCreated.toDate())
        //       .local()
        //       .format("MM-DD-YYYY hh:mm:ss a");
        //   },
        // },
      ],
    },
  };
};

export default TableHeaders;
