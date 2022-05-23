import { getDocs } from "firebase/firestore";
import { FirebaseReadQueries } from "../FirebaseReadQueries";

// Return whether the given course is valid to submit to database
// Returns [bool, "error text"]
export const CheckUserID = (userID) => {
    // Format: 1 letter followed by 4 numbers

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Cheatsheet#groups_and_ranges
    // a{n} - matches exactly n occurrences of a. a{2} doesn't match a in candy, matches 2
    // a's in caandy, and 2 a's if theres 3 or more a's
    // To check if user id is valid, run this reg ex to get the first letter, then the next
    // 4 numbers. If equiv to input ID, the input is valid
    // const r = /[A-Za-z][0-9]{4}/

    // Exec gives list of [matchingStr, index, originalInput, groups]
    // or null if no match
    // const match = r.exec(userID)
    
    // If no match found, or match is only substr of input, throw error
    // if (!match || match[0] != userID) {
    //     return false
    // }

    if (userID.length > 30) {
        return false
    }

    global.config.debug && console.log("\n\nVerified ID: ", userID)
    return true
};
