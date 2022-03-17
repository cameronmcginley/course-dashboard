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

  // Return true/false if course id already exists in database
  if (data.type === "checkCourseID") {
    console.log("Here3");
    return query(
      collection(db, "courses"),
      where("courseID", "==", data.courseID),
      limit(1)
    );
  }

  if (data.type === "signInTableRead") {
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
    } else {
      if (data.getSigninDataType === "refresh") {
        return query(
          collection(db, data.collectionName),
          orderBy(data.sortKey),
          startAt(data.firstVisibleDoc),
          limit(10)
        );
      } else if (data.getSigninDataType === "next") {
        return query(
          collection(db, data.collectionName),
          orderBy(data.sortKey),
          startAfter(data.lastVisibleDoc),
          limit(10)
        );
      } else if (data.getSigninDataType === "previous") {
        return query(
          collection(db, data.collectionName),
          orderBy(data.sortKey),
          endBefore(data.firstVisibleDoc),
          limitToLast(11)
        );
      }
    }
  }
};
