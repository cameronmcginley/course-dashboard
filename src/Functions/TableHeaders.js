import React, { Fragment } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import styled from "styled-components";

// Dependencies for data
import moment from "moment";
import QRCode from "../Components/QRCode";
import PrintQRReport from "../Components/PrintQRReport";
import { IconButton, Box, Link } from "@mui/material";

// Must create header data for each type of table used
const TableHeaders = (props) => {
  if (props.type === "sign-ins-header") {
    return (
      <TableRow>
        <TableCell>User ID</TableCell>
        <TableCell>Course Name</TableCell>
        <TableCell>Course ID</TableCell>
        <TableCell>Date</TableCell>
        <TableCell>Archival Status</TableCell>
      </TableRow>
    )
  }

  if (props.type === "sign-ins") {
    return (
      <>
      <TableCell>{props.row.userID.toUpperCase()}</TableCell>
      <TableCell>{props.row.courseName}</TableCell>
      <TableCell>{props.row.courseID}</TableCell>
      <TableCell sx={{ minWidth: "110px" }}>{moment(props.row.timestampLogged.toDate())
              .local()
              .format("MM-DD-YYYY hh:mm a")
      }</TableCell>
      <TableCell>{props.row.isArchived ? "True" : "False"}</TableCell>
      </>
    )
  }

  if (props.type === "courses-header") {
    return (
      <TableRow>
        <TableCell>Name</TableCell>
        <TableCell>ID</TableCell>
        <TableCell>Info Page</TableCell>
        <TableCell>QR Code</TableCell>
        <TableCell>Instructor</TableCell>
      </TableRow>
    )
  }

  if (props.type === "courses") {
    return (
      <>
      <TableCell>{props.row.courseName}</TableCell>
      <TableCell>{props.row.courseID}</TableCell>
      <TableCell>{
        <Link href={"/courses/" + props.row.courseID + "/attendance"} underline="always">
          {'Info Page'}
        </Link>
      }</TableCell>
      <TableCell>{
        <Fragment>
          {/* <QRCode value={props.row.courseFullStr.toString()} /> */}

          {/* Pass props to this component, which handles
          the ReactToPrint and QRReport references */}
          <PrintQRReport 
            QRvalue={"https://coursedashboard.web.app/courses/" + props.row.courseID + "/attendance"}
            // QRvalue={props.row.courseFullStr.toString()} 
            courseData={props.row} />
        </Fragment>
      }</TableCell>
      <TableCell>{props.row.courseInstructor}</TableCell>
      </>
    )
  }

  if (props.type === "attendance-header") {
    return (
      <TableRow>
        <TableCell>User ID</TableCell>
      </TableRow>
    )
  }

  if (props.type === "attendance") {
    return (
      <>
      <TableCell>{props.row.userID.toUpperCase()}</TableCell>
      </>
    )
  }

  if (props.type === "attendance-info-header") {
    return (
      <TableRow>
        <TableCell>Course Name</TableCell>
        <TableCell>Course ID</TableCell>
        <TableCell>Course Instructor</TableCell>
        <TableCell>Sponsor Agency</TableCell>
        <TableCell>Instructor Agency</TableCell>
        <TableCell>Coordinator</TableCell>
        <TableCell>Synopsis</TableCell>
      </TableRow>
    )
  }

  if (props.type === "attendance-info") {
    return (
      <>
      <TableCell>{props.row.courseName}</TableCell>
      <TableCell>{props.row.courseID}</TableCell>
      <TableCell>{props.row.courseInstructor}</TableCell>
      <TableCell>{props.row.sponsorAgency}</TableCell>
      <TableCell>{props.row.instructorAgency}</TableCell>
      <TableCell>{props.row.coordinator}</TableCell>
      <TableCell>{props.row.synopsis}</TableCell>
      </>
    )
  }
};

export default TableHeaders;
