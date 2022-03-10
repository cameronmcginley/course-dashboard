import React from 'react';
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
import { db, auth } from "../../firebase-config";

export const FirebaseQuery = (type, isDaily, accessor, sortKey, db, firstVisibleDoc, lastVisibleDoc, daySortKeyLargest, courseID) => {
        console.log("FirebaseQuery")
        // console.log(type, isDaily, accessor, sortKey, db, firstVisibleDoc, lastVisibleDoc, daySortKeyLargest, courseID)
        if (isDaily) {
                if (type === "refresh") {
                        return (query(
                                collection(db, accessor),
                                where(sortKey, '<', daySortKeyLargest),
                                // Requires index on firebase for multi query
                                where("courseID", "==", Number(courseID)),
                                orderBy(sortKey),
                                startAt(firstVisibleDoc),
                                limit(10)
                        ))
                }
                else if (type === "next") {
                        return (query(
                                collection(db, accessor),
                                where(sortKey, '<', daySortKeyLargest),
                                where("courseID", "==", Number(courseID)),
                                orderBy(sortKey),
                                startAfter(lastVisibleDoc),
                                limit(10)
                        ))
                }
                else if (type === "previous") {
                        return (query(
                                collection(db, accessor),
                                where(sortKey, '<', daySortKeyLargest),
                                where("courseID", "==", Number(courseID)),
                                orderBy(sortKey),
                                endBefore(firstVisibleDoc),
                                limitToLast(11)
                        ))
                }
        }
        else {
                if (type === "refresh") {
                        return (query(
                                collection(db, accessor),
                                orderBy(sortKey),
                                startAt(firstVisibleDoc),
                                limit(10)
                        ))
                }
                else if (type === "next") {
                        return (query(
                                collection(db, accessor),
                                orderBy(sortKey),
                                startAfter(lastVisibleDoc),
                                limit(10)
                        ))
                }
                else if (type === "previous") {
                        return (query(
                                collection(db, accessor),
                                orderBy(sortKey),
                                endBefore(firstVisibleDoc),
                                limitToLast(11)
                        ))
                }
        }

}
