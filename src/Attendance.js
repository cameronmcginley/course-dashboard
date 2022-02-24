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

const Attendance = () => {
  const { courseid } = useParams()


  return (
    <div>{courseid}</div>  
  );
}



export default Attendance;