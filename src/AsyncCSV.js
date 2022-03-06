import React, { Component } from 'react';
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
    where
} from "firebase/firestore";
import { db } from "./firebase-config";
import moment from 'moment';

const headers = [
  { label: "User ID", key: "userID" },
  { label: "Course Name", key: "courseName" },
  { label: "Course ID", key: "courseID" },
  { label: "Timestamp Logged", key: "timestampLogged" },
  { label: "Last Modified", key: "lastModified" }
];

class AsyncCSV extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.csvLinkEl = React.createRef();
  }

  getData = async () => {
    console.log("Generating CSV report with all data")
    console.log(this.props)
    console.log(this.props.queries.userID)

    // Makes unique query for earch search field
    // Can only have one "in" per query, must make new query for each field
    // https://firebase.google.com/docs/firestore/query-data/queries#compound_queries
    if (this.props.queries.userID) {
      console.log("Querying User ID")
      var data = query(collection(db, "sign-ins"), 
        where("substrArrUserID", "array-contains", this.props.queries.userID),
        // orderBy("sortKey"), 
        limit(10));

      // Get new list of docs for each query
      // Get overlapping set if using multiple queries
      var documentSnapshots = await getDocs(data);
    }
    // if (this.props.queries.courseName) {

    // }
    // if (this.props.queries.courseID) {

    // }
    // // No props
    if (!this.props.queries.userID && !this.props.queries.courseName && !this.props.queries.courseID){
      var data = query(collection(db, "sign-ins"), 
        orderBy("sortKey"), 
        limit(10));
      var documentSnapshots = await getDocs(data);
    }

    // Only maps specific data, and reformats timestamps
    let signinData = []
    documentSnapshots.forEach((doc) => {
        signinData.push({
            'userID': doc.data().userID,
            'courseName': doc.data().courseName,
            'courseID': doc.data().courseID,
            'timestampLogged': moment(doc.data().timestampLogged.toDate()).local().format("MM-DD-yyyy HH:mm:ss"),
            'lastModified': moment(doc.data().lastModified.toDate()).local().format("MM-DD-yyyy HH:mm:ss")
        })
      });

    console.log(signinData)
    return signinData
  }

  downloadReport = async () => {
    const data = await this.getData();
    this.setState({ data: data }, () => {
      setTimeout(() => {
        this.csvLinkEl.current.link.click();
      });
    });
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        <input type="button" value="Export all to CSV" onClick={this.downloadReport} />
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