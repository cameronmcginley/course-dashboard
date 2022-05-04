import React from "react";
import QRCodeReact from "qrcode.react";
import "../App.css";
import SplitCourseFullStr from "../Functions/SplitCourseFullStr";
import { Box, Container } from "@mui/material";

// Using a class component, everything works without issue
export class QRReport extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="printComponent">
        {/* <Box sx={{ backgroundColor: "red", m:0, p:0, width: '25%'}}> */}
        <Box className="printText">
          <h1 className="qrReport title"><b>Course: </b>{this.props.courseData.courseName}</h1>
          <h1 className="qrReport body"><b>ID: </b>{this.props.courseData.courseID}</h1>
          <br />
          <h1 className="qrReport body"><b>Instructor(s): </b>{this.props.courseData.courseInstructor}</h1>
          <h1 className="qrReport body"><b>Instructor Agency: </b>{this.props.courseData.instructorAgency}</h1>
          <h1 className="qrReport body"><b>Sponsor Agency: </b>{this.props.courseData.sponsorAgency}</h1>
          <h1 className="qrReport body"><b>Coordinator: </b>{this.props.courseData.coordinator}</h1>
          <br />
          <h1 className="qrReport body"><b>Synopsis: </b>{this.props.courseData.synopsis}</h1>
        </Box>

        <div className="qrReport qrCode">
          <QRCodeReact
            renderAs="svg"
            // className="qrReport qrCode"
            size={200}
            value={this.props.QRvalue}
          />
          <h1 className="qrReport qrCodeText">Must scan via official "Course Sign-In" iOS app</h1>
        </div>
      </div>
    );
  }
}
