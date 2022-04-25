import { getDocs } from "firebase/firestore";
import { FirebaseReadQueries } from "../FirebaseReadQueries";
import { CheckCourseName } from "./CheckCourseName";
import { CheckCourseID } from "./CheckCourseID";
import { FirebaseWriteQueries } from "../FirebaseWriteQueries";

// Return whether the given course is valid to submit to database
// Returns [bool, "error text"]
export const CheckCourseSubmission = async (isEdit, courseName, courseID, useAutoCourseID) => {
  let autoIDIncrementAmount = 1

  // Check if we have enough inputs for the submission type
  if (!isEdit) {
    if (!courseName || !courseID) {
      return [false, "Missing input(s)"]
    }
  }
  // else {
  //   if (!courseName && !courseID) {
  //     return [false, "Missing input(s)"]
  //   }
  // }
  
  // Individually check name and ID
  if (courseName) {
    const isCourseNameValid = CheckCourseName(courseName)
    if (isCourseNameValid[0] === false) {
      return  isCourseNameValid
    }
  }

  if (courseID) {
    const isCourseIDValid = CheckCourseID(courseID)
    if (isCourseIDValid[0] === false) {
      return  isCourseIDValid
    }
  }

  // Check if course ID already exists
  let docs = await FirebaseReadQueries({
    type: "checkCourseID",
    collectionName: "courses",
    courseID: courseID,
  });

  // Keep incrementing if courseID in use and autoCourseID is on
  if (useAutoCourseID){
    // docs[0] exists if courseID already in use
    while (docs[0]) {
      console.log("\nCourse ID " + courseID + " already exists")

      // Increment the courseID and try again
      courseID = String(Number(courseID) + 1)
      autoIDIncrementAmount += 1

      docs = await FirebaseReadQueries({
        type: "checkCourseID",
        collectionName: "courses",
        courseID: courseID,
      });
    }
  }
  else {
    if (docs[0]) {
      return [false, "ID Already In Use"];
    }
  }

  // Increment auto id if it was used
  if (useAutoCourseID) {
    FirebaseWriteQueries({
      type: "incrementAutoCourseID",
      incrementAmt: autoIDIncrementAmount,
    });
  }

  // No errors found
  console.log("Verified: ", courseName, courseID)
  console.log("Auto id incremented by " + autoIDIncrementAmount)
  return [true, "", courseID];
};
