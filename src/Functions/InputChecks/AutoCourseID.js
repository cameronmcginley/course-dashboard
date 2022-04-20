import { getDocs } from "firebase/firestore";
import { FirebaseReadQueries } from "../FirebaseReadQueries";

// Return whether the given course is valid to submit to database
// Returns [bool, "error text"]
export const AutoCourseID = async () => {
  // Get the nextCourseIDIncrement value from constants > only doc > field
  const data = await FirebaseReadQueries({
    type: "constantsFetch",
  });

  const documentSnapshots = await getDocs(data);

  const nextCourseIDIncrement = documentSnapshots.docs[0].data().nextCourseIDIncrement;
  console.log(nextCourseIDIncrement)

  return nextCourseIDIncrement
};
