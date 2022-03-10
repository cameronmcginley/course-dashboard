import namor from "namor";
import moment from "moment";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import { collection, getDocs, setDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import React, { useMemo } from "react";

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

const makeData = async () => {
  const signinCollectionRef = collection(db, "sign-ins");

  for (let i = 0; i < 45; i++) {
    let userID = namor.generate({ words: 1, numbers: 0 });
    await addDoc(signinCollectionRef, {
      userID: userID,
      courseName: namor.generate({ words: 1, numbers: 0 }),
      courseID: Math.floor(Math.random() * 30),
      timestampLogged: dates[i],
      isArchived: false,
      lastModified: dates[i],
      sortKey: 9999999999999 - dates[i].getTime(),
      substrArrUserID: createSubstringArray(userID),
    });
  }
};

// makeData()
