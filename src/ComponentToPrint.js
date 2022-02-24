import React, { Component, useState, useEffect } from "react";
import "./Attendance.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  FieldValue,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

// Using a class component, everything works without issue
export class ComponentToPrint extends React.PureComponent {
    render() {
      return (
        <div className='ComponentToPrint'>My cool content here!</div>
      );
    }
  }
  
  // Using a functional component, you must wrap it in React.forwardRef, and then forward the ref to
  // the node you want to be the root of the print (usually the outer most node in the ComponentToPrint)
  // https://reactjs.org/docs/refs-and-the-dom.html#refs-and-function-components
//   export const ComponentToPrint = React.forwardRef((props, ref) => {
//     return (
//       <div ref={ref}>My cool content here!</div>
//     );
//   });