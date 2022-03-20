import React from "react";
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
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import SplitCourseFullStr from "../Functions/SplitCourseFullStr"

// Convert text to array of all possible substrings
// Necessary for filtering, as firebase doesn't allow to search for substrings
const createSubstringArray = (text) => {
  var substringArray = [];
  var characterCounter = 1;
  let textLowercased = text.toLowerCase();
  let characterCount = text.length;
  // console.log(characterCount)

  // Create array of all substrings
  for (let _ = 0; _ < characterCount; _++) {
    for (let x = 0; x < characterCount; x++) {
      let lastCharacter = x + characterCounter;
      if (lastCharacter <= characterCount) {
        let substring = textLowercased.substring(x, lastCharacter); //textLowercased[x..<lastCharacter]
        substringArray.push(substring);
      }
    }
    characterCounter += 1;

    // let max = maximumStringSize
    let max = text.length;
    if (characterCounter > max) {
      break;
    }
  }

  // Add empty string for defautl firebase query
  substringArray.push("");

  // Remove duplicates from array
  substringArray = [...new Set(substringArray)];

  console.log(substringArray);
  return substringArray;
};

export const FirebaseWriteQueries = (data) => {
  console.log("Firebase Write");

  let logTime = null
  if (data.timestamp) {
    logTime = Timestamp.fromDate(data.timestamp)
  } else {
    logTime = new Date();
  }
  console.log("Write Time: ", logTime)

  if (data.collectionName === "courses") {
    const newCourseFullStr = data.newCourseName + " " + "(ID " + data.newCourseID + ")"

    addDoc(collection(db, data.collectionName), {
      courseID: data.newCourseID,
      courseName: data.newCourseName,
      courseFullStr: newCourseFullStr,
      timeCreated: logTime,
      lastModified: logTime,

      substrCourseID: createSubstringArray(data.newCourseID),
      substrCourseName: createSubstringArray(data.newCourseName),
    });
  }

  if (data.collectionName === "sign-ins") {
    let courseArray = SplitCourseFullStr(data.newCourseFullStr)
    console.log("Write course data: ", courseArray)
    
    addDoc(collection(db, data.collectionName), {
      userID: data.newUserID,
      courseName: courseArray[0],
      courseID: courseArray[1],
      courseFullStr: data.newCourseFullStr,
      timestampLogged: logTime,
      lastModified: logTime,
      sortKey: 9999999999999 - logTime,
      isArchived: false,

      // Firebase doesn't allow querying "string contains"
      // Add an array of all char combinations so we can search them later
      // Other fields, like course name and ID, we will search by exact match
      substrUserID: createSubstringArray(data.newUserID),
      // substrCourseName: createSubstringArray(courseArray[0]),
      // substrCourseID: createSubstringArray(courseArray[1]),
    });
  }
};