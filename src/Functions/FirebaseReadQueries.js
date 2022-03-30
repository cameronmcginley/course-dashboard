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
} from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { endOfDay, startOfDay } from 'date-fns';
import getSortKey from "./getSortKey";

export const FirebaseReadQueries = async (data) => {
  console.log(
    "Firebase Read", 
    "\nSearch Critera: ", data.searchCriteria,
    "\nType: ", data.type,
  );

  if (data.type === "getCourseName") {
    return query(
      collection(db, "courses"),
      where("courseID", "==", data.courseID),
      limit(1)
    );
  }

  // Return true/false if course id already exists in database
  if (data.type === "checkCourseID") {
    console.log("Here3");
    return query(
      collection(db, "courses"),
      where("courseID", "==", data.courseID),
      limit(1)
    );
  }

  //CSV Queries
  if (data.type === "CSV") {
    const params = [
      collection(db, "sign-ins"),
      orderBy("sortKey"),
      limit(10)
    ]
    if (data.searchCriteria.courseID) {
      params.push(where("courseID", "==", data.searchCriteria.courseID))
    }
    if (data.searchCriteria.userID) {
      params.push(where("substrUserID", "array-contains", data.searchCriteria.userID))
    }
    if (data.searchCriteria.startDate) {
      // Convert the start and end dates to sortKey format
      // endDate must be set to last second of the day
      const startDateKey = getSortKey(data.searchCriteria.startDate)
      const endDateKey = getSortKey(data.searchCriteria.endDate)

      params.push(where("sortKey", "<=", startDateKey))
      params.push(where("sortKey", ">=", endDateKey))
    }
    if (data.searchCriteria.searchArchived) {
      params.push(where("isArchived", "==", true))
    }

    return query(
      ...params
    );
  }

  // Is first page
  if (data.type === "isFirstPage") {
    const params = [
      collection(db, data.collectionName),
      orderBy(data.sortKey),
      endBefore(data.firstVisibleDoc),
      limit(1)
    ]

    // Optional Queries
    if (data.searchCriteria.searchUserID) {
      params.push(where("substrUserID", "array-contains", data.searchCriteria.searchUserID))
    }
    if (data.searchCriteria.searchCourseID) {
      params.push(where("courseID", "==", data.searchCriteria.searchCourseID))
    }
    if (data.searchCriteria.startDate) {
      const startDateKey = getSortKey(data.searchCriteria.startDate)
      const endDateKey = getSortKey(data.searchCriteria.endDate)

      params.push(where("sortKey", "<=", startDateKey))
      params.push(where("sortKey", ">=", endDateKey))
    }
    if (data.searchCriteria.searchArchived) {
      params.push(where("isArchived", "==", true))
    }

    return query(
      ...params
    );
  }

  // Is last page
  if (data.type === "isLastPage") {
    const params = [
      collection(db, data.collectionName),
      orderBy(data.sortKey),
      startAfter(data.lastVisibleDoc),
      limit(1),
    ]

    // Optional Queries
    if (data.searchCriteria.searchUserID) {
      params.push(where("substrUserID", "array-contains", data.searchCriteria.searchUserID))
    }
    if (data.searchCriteria.searchCourseID) {
      params.push(where("courseID", "==", data.searchCriteria.searchCourseID))
    }
    if (data.searchCriteria.startDate) {
      const startDateKey = getSortKey(data.searchCriteria.startDate)
      const endDateKey = getSortKey(data.searchCriteria.endDate)

      params.push(where("sortKey", "<=", startDateKey))
      params.push(where("sortKey", ">=", endDateKey))
    }
    if (data.searchCriteria.searchArchived) {
      params.push(where("isArchived", "==", true))
    }

    return query(
      ...params
    );
  }
  // DO THIS WITH ALL OTHER QUERIES, DON'T USE THE IF STATEMENTS
  // CONVERT DAYSORTKEYLARGEST TO THE DATE QUERY METHOD WHEN THAT'S ADDED

  if (data.collectionName === "sign-ins") {
    const params = [
      collection(db, data.collectionName),
      where("substrUserID", "array-contains", data.searchCriteria.searchUserID),
      orderBy(data.sortKey),
    ]

    // Type
    if (data.getSigninDataType === "refresh") {
      params.push(startAt(data.firstVisibleDoc))
      params.push(limit(10))
    }
    if (data.getSigninDataType === "next") {
      params.push(startAfter(data.lastVisibleDoc))
      params.push(limit(10))
    }
    if (data.getSigninDataType === "previous") {
      params.push(endBefore(data.firstVisibleDoc))
      params.push(limitToLast(11))
    }

    // Optional Queries
    if (data.searchCriteria.searchCourseID) {
      params.push(where("courseID", "==", data.searchCriteria.searchCourseID))
    }
    if (data.searchCriteria.startDate) {
      const startDateKey = getSortKey(data.searchCriteria.startDate)
      const endDateKey = getSortKey(data.searchCriteria.endDate)

      params.push(where("sortKey", "<=", startDateKey))
      params.push(where("sortKey", ">=", endDateKey))
    }
    if (data.type === "attendance") {
      const startDateKey = getSortKey(startOfDay(new Date()))
      const endDateKey = getSortKey(endOfDay(new Date()))

      params.push(where("sortKey", "<=", startDateKey))
      params.push(where("sortKey", ">=", endDateKey))
    }
    if (data.searchCriteria.searchArchived) {
      params.push(where("isArchived", "==", true))
    }

    return query(
      ...params
    );
  }

  if (data.collectionName === "courses") {
    console.log("Courses read")
    const params = [
      collection(db, data.collectionName),
      orderBy(data.sortKey),
    ]

    // Type
    if (data.getSigninDataType === "refresh") {
      params.push(startAt(data.firstVisibleDoc))
      params.push(limit(10))
    }
    if (data.getSigninDataType === "next") {
      params.push(startAfter(data.lastVisibleDoc))
      params.push(limit(10))
    }
    if (data.getSigninDataType === "previous") {
      params.push(endBefore(data.firstVisibleDoc))
      params.push(limitToLast(11))
    }

    // Optional queries
    if (data.searchCriteria.searchCourseID) {
      params.push(where("courseID", "==", data.searchCriteria.searchCourseID))
    }

    return query(
      ...params
    );
  }

};
