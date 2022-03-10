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

export const FirebaseQuery = (type, isDaily, accessor, sortKey, db, firstVisibleDoc, lastVisibleDoc, daySortKeyLargest) => {
        console.log("FirebaseQuery")
        if (isDaily) {
                if (type === "refresh") {
                        return (query(
                                collection(db, accessor),
                                where(sortKey, '<', daySortKeyLargest),
                                orderBy(sortKey),
                                startAt(firstVisibleDoc),
                                limit(10)
                        ))
                }
                else if (type === "next") {
                        return (query(
                                collection(db, accessor),
                                where(sortKey, '<', daySortKeyLargest),
                                orderBy(sortKey),
                                startAfter(lastVisibleDoc),
                                limit(10)
                        ))
                }
                else if (type === "previous") {
                        return (query(
                                collection(db, accessor),
                                where(sortKey, '<', daySortKeyLargest),
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

export const StandardRefresh = (accessor, sortKey, db, firstVisibleDoc) => { 
        return (query(
                collection(db, accessor),
                orderBy(sortKey),
                startAt(firstVisibleDoc),
                limit(10)
        ))
}

export const StandardPrevious = (accessor, sortKey, db, firstVisibleDoc) => { 
        return (query(
                collection(db, accessor),
                orderBy(sortKey),
                endBefore(firstVisibleDoc),
                limitToLast(11)
        ))
}

export const StandardNext = (accessor, sortKey, db, lastVisibleDoc) => { 
        return (query(
                collection(db, accessor),
                orderBy(sortKey),
                startAfter(lastVisibleDoc),
                limit(10)
        ))
}

// const OneDayGet = (props) => { 
//         return (query(
//                 collection(db, props.accessor),
//                 where(props.sortKey, '<', props.daySortKeyLargest),
//                 orderBy(props.sortKey),
//                 startAt(firstVisibleDoc),
//                 limit(10)
//         ))
// }
