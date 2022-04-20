import { getDocs } from "firebase/firestore";
import { FirebaseReadQueries } from "../FirebaseReadQueries";
import { CheckUserID } from "./CheckUserID"

// Return whether the sign-in information is valid
// by checking the userID and the courseFullStr
export const CheckUserSignin = (userID, newUserCourseFullStr) => {
    // CourseFullStr just can't be empty. No way for user to modify this and submit
    const isUserIDValid = CheckUserID(userID)
    console.log(isUserIDValid)

    if (!isUserIDValid) {
        return [false, "Invalid User ID"];
    }
    if (!newUserCourseFullStr) {
        return [false, "Invalid courseFullStr"];
    }

    // No errors found
    console.log("Verified: ", userID, newUserCourseFullStr)
    return [true, ""];
};
