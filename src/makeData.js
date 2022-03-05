import namor from 'namor'
import moment from 'moment'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import { collection, getDocs , setDoc, addDoc } from "firebase/firestore"; 
import { db } from "./firebase-config";
import React, { useMemo } from 'react';

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
    end: new Date(2040, 9, 10)
})

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

const makeData = async () => {
    const signinCollectionRef = collection(db, "sign-ins");

    for (let i = 0; i < 100; i++) {
        await addDoc(signinCollectionRef, 
            { userID: namor.generate({ words: 1, numbers: 0 }),
            courseName: namor.generate({ words: 1, numbers: 0 }),
            courseID: Math.floor(Math.random() * 30),
            timestampLogged: dates[i],
            isArchived: false,
            lastMofidified: dates[i]
        });
    }
}

// // makeData()