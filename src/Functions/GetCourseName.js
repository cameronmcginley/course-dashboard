import react from "react";
import { FirebaseReadQueries } from "./FirebaseReadQueries";
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

// Takes in CourseFullStr, returns [courseName, courseID] both as string
export const GetCourseName = async (courseID) => {
  // Takes course ID
  // Reads from database to get this course

  const data = await FirebaseReadQueries({
    type: "getCourseName",
    courseID: courseID,
  });

  // Get course name from the data
  const documentSnapshots = await getDocs(data);

  // If course name doesn't exist, return an error message
  if (!documentSnapshots.docs[0]) {
    return "error";
  }

  console.log("Course Name: ", documentSnapshots.docs[0].data().courseName);

  return documentSnapshots.docs[0].data().courseName;
};
