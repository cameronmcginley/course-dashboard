import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  query,
  limit,
  where,
  Timestamp,
  increment,
} from "firebase/firestore";
import { db } from "../firebase-config";
import SplitCourseFullStr from "../Functions/SplitCourseFullStr";
import getSortKey from "./getSortKey";

// Convert text to array of all possible substrings
// Necessary for filtering, as firebase doesn't allow to search for substrings
const createSubstringArray = (text) => {
  var substringArray = [];
  var characterCounter = 1;
  let textLowercased = text.toString().toLowerCase();
  let characterCount = text.length;
  // console.log(characterCount)

  // Create array of all substrings
  for (let _ = 0; _ < characterCount; _++) {
    for (let x = 0; x < characterCount; x++) {
      let lastCharacter = x + characterCounter;
      if (lastCharacter <= characterCount) {
        let substring = textLowercased.substring(x, lastCharacter); //textLowercased[x..<lastCharacter]
        substringArray.push(substring);
      }
    }
    characterCounter += 1;

    // let max = maximumStringSize
    let max = text.length;
    if (characterCounter > max) {
      break;
    }
  }

  // Add empty string for defautl firebase query
  substringArray.push("");

  // Remove duplicates from array
  substringArray = [...new Set(substringArray)];

  // console.log(substringArray);
  return substringArray;
};

// data.timestamp = JS Date obj, not Firebase Timestamp
// Blank by default
export const FirebaseWriteQueries = async (data) => {
  console.log("Firebase Write");

  let logTime = null;
  if (data.timestamp) {
    logTime = Timestamp.fromDate(data.timestamp);
  } else {
    logTime = Timestamp.now();
  }
  console.log("Write Time: ", logTime);

  if (data.type === "incrementAutoCourseID") {
    // Long string is the doc id
    const docRef = doc(db, "constants", "Iw8s0y01fiokNk81heh1");

    // Atomically increment the population of the city by 50.
    await updateDoc(docRef, {
        nextCourseIDIncrement: increment(data.incrementAmt)
    });
  }

  if (data.type === "courseEdit") {
    // Assign the values to be set, if no change just set to current value
    let setCourseName;
    let setCourseID;
    data.newCourseName
      ? (setCourseName = data.newCourseName)
      : (setCourseName = data.currCourseName);
    data.newCourseID
      ? (setCourseID = data.newCourseID)
      : (setCourseID = data.currCourseID);

    const newCourseFullStr = setCourseName + " " + "{ID " + setCourseID + "}";

    // Find doc id by reading old course id
    var data = query(
      collection(db, "courses"),
      limit(1),
      where("courseID", "==", data.currCourseID)
    );
    const documentSnapshots = await getDocs(data);
    const docID = documentSnapshots.docs[0].id;
    console.log("Editing DocID: ", docID);

    await updateDoc(doc(db, "courses", docID), {
      courseFullStr: newCourseFullStr,
      courseID: setCourseID,
      courseName: setCourseName,
      lastModified: logTime,
    });

    // Set substr coursename or id?
    // May not need to, when do we ever search by this?

    return;
  }

  if (data.collectionName === "courses") {
    const newCourseFullStr =
      data.newCourseName + " " + "{ID " + data.newCourseID + "}";

    addDoc(collection(db, data.collectionName), {
      courseID: data.newCourseID,
      courseName: data.newCourseName,
      courseFullStr: newCourseFullStr,
      timeCreated: logTime,
      lastModified: logTime,

      // substrCourseID: createSubstringArray(data.newCourseID),
      // substrCourseName: createSubstringArray(data.newCourseName),
    });

    return;
  }

  if (data.collectionName === "sign-ins") {
    let courseArray = SplitCourseFullStr(data.newCourseFullStr);
    // console.log("Write course data: ", courseArray);

    addDoc(collection(db, data.collectionName), {
      userID: data.newUserID,
      courseName: courseArray[0],
      courseID: courseArray[1],
      courseFullStr: data.newCourseFullStr,
      timestampLogged: logTime,
      lastModified: logTime,
      sortKey: getSortKey(logTime),
      isArchived: false,

      // Firebase doesn't allow querying "string contains"
      // Add an array of all char combinations so we can search them later
      // Other fields, like course name and ID, we will search by exact match
      substrUserID: createSubstringArray(data.newUserID),
      // substrCourseName: createSubstringArray(courseArray[0]),
      // substrCourseID: createSubstringArray(courseArray[1]),
    });

    return;
  }
};
