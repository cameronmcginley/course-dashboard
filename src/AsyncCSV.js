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
    setState
} from "firebase/firestore";
import { db } from "./firebase-config";

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

  getUserList = async () => {
    // return fetch('https://jsonplaceholder.typicode.com/users')
    //   .then(res => res.json());
    console.log("Generating CSV report with all data")

    var data = query(collection(db, "sign-ins"), orderBy("sortKey"), limit(10));
    const documentSnapshots = await getDocs(data);

    // console.log((documentSnapshots.docs.map((doc) => ({ ...doc.data(), id: doc.id }))))

    return (documentSnapshots.docs.map((doc) => ({ 
      // ...
      ...doc.data()
      // doc.data()
    })))
  }

  downloadReport = async () => {
    const data = await this.getUserList();
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
        <input type="button" value="Export to CSV (Async)" onClick={this.downloadReport} />
        <CSVLink
          headers={headers}
          filename="Clue_Mediator_Report_Async.csv"
          data={data}
          ref={this.csvLinkEl}
        />
      </div>
    );
  }
}

export default AsyncCSV;