import namor from "namor";
import moment from "moment";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import { db } from "../firebase-config";
import React, { useMemo } from "react";
import { FirebaseWriteQueries } from "../Functions/FirebaseWriteQueries";
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
  Timestamp,
} from "firebase/firestore";

// const range = len => {
//   const arr = []
//   for (let i = 0; i < len; i++) {
//     arr.push(i)
//   }
//   return arr
// }

// function randomDate(start, end) {
//     return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
//   }

const dates = eachDayOfInterval({
  start: new Date(2000, 9, 6),
  end: new Date(2040, 9, 10),
});

// const newPerson = (i) => {
//   const statusChance = Math.random()
//     return {
//         userID: namor.generate({ words: 1, numbers: 0 }),
//         courseName: namor.generate({ words: 1, numbers: 0 }),
//         courseID: Math.floor(Math.random() * 30),
//         // timestampLogged: moment(new Date(+(new Date()) - Math.floor(Math.random()*10000000000))).format('MMMM Do YYYY, h:mm:ss a'),
//         // timestampLogged: new Date(+(new Date()) - Math.floor(Math.random()*10000000000)),
//         timestampLogged: dates[i],
//         isArchived:
//         statusChance > 0.66
//             ? 'Archived'
//             : 'Unarchived'
//     }
// }

const createSubstringArray = (text) => {
  var substringArray = [];
  var characterCounter = 1;
  let textLowercased = text.toLowerCase();
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

  // Remove duplicates from array
  substringArray = [...new Set(substringArray)];

  console.log(substringArray);
  return substringArray;
};

const getCourseList = async () => {
  // Get all courses for the dropdown
  var data = query(collection(db, "courses"), orderBy("courseName"), limit(10));
  var documentSnapshots = await getDocs(data);

  // Only get course, give it a display name with name + id
  let courseList = [];
  documentSnapshots.forEach((doc) => {
    courseList.push(doc.data().courseID)
  });

  console.log(courseList);
  return courseList;
};

function randomDate(start, end, startHour, endHour) {
  var date = new Date(+start + Math.random() * (end - start));
  var hour = startHour + Math.random() * (endHour - startHour) | 0;
  date.setHours(hour);
  return date;
}

const makeData = async () => {
  let courseList = await getCourseList()

  for (let i = 0; i < 45; i++) {
    FirebaseWriteQueries({
      collectionName: "sign-ins",
      newUserID: namor.generate({ words: 1, numbers: 0 }),
      newUserCourseID: String(courseList[Math.floor(Math.random()*courseList.length)]), //Random from courselist IDs
      timestamp: randomDate(new Date(2020, 0, 1), new Date(), 0, 24),
    });

  }
};

// makeData()
