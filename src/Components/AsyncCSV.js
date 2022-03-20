import React, { Component } from "react";
import { CSVLink } from "react-csv";

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
} from "firebase/firestore";
import { db } from "../firebase-config";
import moment from "moment";
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";

const headers = [
  { label: "User ID", key: "userID" },
  { label: "Course Name", key: "courseName" },
  { label: "Course ID", key: "courseID" },
  { label: "Timestamp Logged", key: "timestampLogged" },
  { label: "Last Modified", key: "lastModified" },
];

class AsyncCSV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.csvLinkEl = React.createRef();
  }

  getData = async () => {
    console.log("Generating CSV report with all data");
    console.log(this.props);
    console.log(this.props.queries.userID);

    // Repackages "props.queries" into searchCriteria
    const searchCriteria = {
      courseFullStr: this.props.queries.courseFullStr,
      courseID: this.props.queries.searchCourseID,
      userID: this.props.queries.searchUserID
    }

    const data = await FirebaseReadQueries({
      type: "CSV",
      searchCriteria: searchCriteria,
    });

    var documentSnapshots = await getDocs(data);


    // Only maps specific data, and reformats timestamps
    let signinData = [];
    documentSnapshots.forEach((doc) => {
      signinData.push({
        userID: doc.data().userID,
        courseName: doc.data().courseName,
        courseID: doc.data().courseID,
        timestampLogged: moment(doc.data().timestampLogged.toDate())
          .local()
          .format("MM-DD-yyyy HH:mm:ss"),
        lastModified: moment(doc.data().lastModified.toDate())
          .local()
          .format("MM-DD-yyyy HH:mm:ss"),
      });
    });

    console.log(signinData);
    return signinData;
  };

  downloadReport = async () => {
    const data = await this.getData();
    this.setState({ data: data }, () => {
      setTimeout(() => {
        this.csvLinkEl.current.link.click();
      });
    });
  };

  render() {
    const { data } = this.state;

    return (
      <div>
        <input
          type="button"
          value="Export all to CSV"
          onClick={this.downloadReport}
        />
        <CSVLink
          headers={headers}
          filename={"SignInDataReport-" + moment().format("MMDDYYYY_HHmmss")}
          data={data}
          ref={this.csvLinkEl}
        />
      </div>
    );
  }
}

export default AsyncCSV;
