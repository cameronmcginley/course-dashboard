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
import { db, auth } from "../firebase-config";

export const FirebaseReadQueries = async (data) => {
        console.log("Firebase Read")

        // Return true/false if course id already exists in database
        if (data.type === "checkCourseID") {
                console.log("Here3")
                return (query(
                        collection(db, "courses"),
                        where("courseID", "==", data.courseID),
                        limit(1)
                ))

        }
}
