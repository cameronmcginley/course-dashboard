import { getDocs } from "firebase/firestore";
import { FirebaseReadQueries } from "../FirebaseReadQueries";

// Return whether the given course is valid to submit to database
// Returns [bool, "error text"]
export const CheckCourseSubmission = async (isEdit, courseName, courseID) => {
  // Check if inputs are valid
  if (courseName && courseID) {
    // Implement checks later, seperate func file
  }
  // Don't need both if editing
  else if (isEdit) {
  } else {
    return [false, "Invalid Input(s)"];
  }

  // Check if course ID already exists
  const data = await FirebaseReadQueries({
    type: "checkCourseID",
    collectionName: "courses",
    courseID: courseID,
  });
  const documentSnapshots = await getDocs(data);

  if (documentSnapshots.docs[0]) {
    return [false, "ID Already In Use"];
  }

  // No errors found
  return [true, ""];
};
