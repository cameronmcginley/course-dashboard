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

export const FirebaseReadQueries = async (data) => {
  console.log("Firebase Read");

  if (data.searchCriteria) {
    console.log("Search Criteria: ", data.searchCriteria)

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

  // If daySortKeyLargest exists, only search for one day's data
  if (data.daySortKeyLargest) {
    if (data.getSigninDataType === "refresh") {
      return query(
        collection(db, data.collectionName),
        where(data.sortKey, "<", data.daySortKeyLargest),
        // Requires index on firebase for multi query
        where("courseID", "==", Number(data.courseID)),
        orderBy(data.sortKey),
        startAt(data.firstVisibleDoc),
        limit(10)
      );
    } else if (data.getSigninDataType === "next") {
      return query(
        collection(db, data.collectionName),
        where(data.sortKey, "<", data.daySortKeyLargest),
        where("courseID", "==", Number(data.courseID)),
        orderBy(data.sortKey),
        startAfter(data.lastVisibleDoc),
        limit(10)
      );
    } else if (data.getSigninDataType === "previous") {
      return query(
        collection(db, data.collectionName),
        where(data.sortKey, "<", data.daySortKeyLargest),
        where("courseID", "==", Number(data.courseID)),
        orderBy(data.sortKey),
        endBefore(data.firstVisibleDoc),
        limitToLast(11)
      );
    }
  } 

  else {
    // Can only have one array-contains per query
    // But can have many "=="
    // This finds a way to only use userID for searching by string,
    // everything else can be done exact through dropdowns of specific options
    // when searching

    // Search includes course ID
    if (data.searchCriteria.searchCourseID) {
      if (data.getSigninDataType === "refresh") {
        return query(
          collection(db, data.collectionName),
          where("substrUserID", "array-contains", data.searchCriteria.searchUserID),
          where("courseID", "==", data.searchCriteria.searchCourseID),
          orderBy(data.sortKey),
          startAt(data.firstVisibleDoc),
          limit(10)
        );
      } else if (data.getSigninDataType === "next") {
        return query(
          collection(db, data.collectionName),
          where("substrUserID", "array-contains", data.searchCriteria.searchUserID),
          where("courseID", "==", data.searchCriteria.searchCourseID),
          orderBy(data.sortKey),
          startAfter(data.lastVisibleDoc),
          limit(10)
        );
      } else if (data.getSigninDataType === "previous") {
        return query(
          collection(db, data.collectionName),
          where("substrUserID", "array-contains", data.searchCriteria.searchUserID),
          where("courseID", "==", data.searchCriteria.searchCourseID),
          orderBy(data.sortKey),
          endBefore(data.firstVisibleDoc),
          limitToLast(11)
        );
      }
    }
    // Search does not include course ID
    else {
      if (data.getSigninDataType === "refresh") {
        return query(
          collection(db, data.collectionName),
          where("substrUserID", "array-contains", data.searchCriteria.searchUserID),
          orderBy(data.sortKey),
          startAt(data.firstVisibleDoc),
          limit(10)
        );
      } else if (data.getSigninDataType === "next") {
        return query(
          collection(db, data.collectionName),
          where("substrUserID", "array-contains", data.searchCriteria.searchUserID),
          orderBy(data.sortKey),
          startAfter(data.lastVisibleDoc),
          limit(10)
        );
      } else if (data.getSigninDataType === "previous") {
        return query(
          collection(db, data.collectionName),
          where("substrUserID", "array-contains", data.searchCriteria.searchUserID),
          orderBy(data.sortKey),
          endBefore(data.firstVisibleDoc),
          limitToLast(11)
        );
      }
    }

  }
};
