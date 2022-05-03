import { FirebaseReadQueries } from "./FirebaseReadQueries";
import { getDocs } from "firebase/firestore";

// Takes in CourseFullStr, returns [courseName, courseID] both as string
export const GetCourseName = async (courseID) => {
  // Takes course ID
  // Reads from database to get this course

  const docs = await FirebaseReadQueries({
    type: "getCourseName",
    courseID: courseID,
  });

  // If course name doesn't exist, return an error message
  if (!docs[0]) {
    return "error";
  }

  global.config.debug && console.log("Course Name: ", docs[0].data().courseName);

  return docs[0].data().courseName;
};
