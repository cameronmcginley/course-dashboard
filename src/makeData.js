import namor from 'namor'
import moment from 'moment'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'
import { collection, getDocs , setDoc } from "firebase/firestore"; 
import { db } from "./firebase-config";
import React, { useMemo } from 'react';

const range = len => {
  const arr = []
  for (let i = 0; i < len; i++) {
    arr.push(i)
  }
  return arr
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

const dates = eachDayOfInterval({
    start: new Date(2000, 9, 6),
    end: new Date(2040, 9, 10)
})

const newPerson = (i) => {
  const statusChance = Math.random()
//   return {
//     firstName: namor.generate({ words: 1, numbers: 0 }),
//     lastName: namor.generate({ words: 1, numbers: 0 }),
//     age: Math.floor(Math.random() * 30),
//     visits: Math.floor(Math.random() * 100),
//     progress: Math.floor(Math.random() * 100),
//     status:
//       statusChance > 0.66
//         ? 'relationship'
//         : statusChance > 0.33
//         ? 'complicated'
//         : 'single',
//   }
    return {
        userID: namor.generate({ words: 1, numbers: 0 }),
        courseName: namor.generate({ words: 1, numbers: 0 }),
        courseID: Math.floor(Math.random() * 30),
        // timestampLogged: moment(new Date(+(new Date()) - Math.floor(Math.random()*10000000000))).format('MMMM Do YYYY, h:mm:ss a'),
        // timestampLogged: new Date(+(new Date()) - Math.floor(Math.random()*10000000000)),
        timestampLogged: dates[i],
        isArchived:
        statusChance > 0.66
            ? 'Archived'
            : 'Unarchived'
    }
}

// async function testQuery(){
//     // Collects firebase docs
//     const querySnapshot = await getDocs(collection(db, "sign-ins"));
//         querySnapshot.forEach((doc) => {
//             // doc.data() is never undefined for query doc snapshots
//             console.log(doc.id, " => ", doc.data());
//     });

//     console.log("")
//     console.log(querySnapshot.docs)

//     // const data = React.useMemo(
//     //     () => [ {}
//     //     ]
//     // )

//     // console.log(data)
// }

// export default async function makeData() {
//     const querySnapshot = await getDocs(collection(db, "sign-ins"));

//     let depth = 0

//     querySnapshot.forEach((doc) => {
//         console.log(doc.id, " => ", doc.data());

//         const len = lens[depth]
//         return range(len).map(d => {
//             return {
//             ...newPerson(i += 1),
//             subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
//             }
//         })
//     });

//     const makeDataLevel = (depth = 0) => {
//         const len = lens[depth]
//         return range(len).map(d => {
//             return {
//             ...newPerson(i += 1),
//             subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
//             }
//         })
//     }

//     testQuery()

//   return makeDataLevel()
// }

// async function testQuery(...lens){
//     // const makeDataLevel = (depth = 0) => {
//     //     const len = lens[depth]
//     //     return range(len).map(d => {
//     //       return {
//     //         ...newPerson(i += 1),
//     //         subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
//     //       }
//     //     })
//     // }


//     // Collects firebase docs
//     const querySnapshot = await getDocs(collection(db, "sign-ins"));


//     querySnapshot.forEach((doc) => {
//         // doc.data() is never undefined for query doc snapshots
//         console.log(doc.id, " => ", doc.data());

//         const makeDataLevel = (depth = 0) => {
//           const len = lens[depth]
//           return range(len).map(d => {
//             return {
//               ...doc.data(),
//               subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
//             }
//           })
//         }

//     });

//     console.log("")
//     console.log(querySnapshot.docs)
// }

export default async function makeData(...lens) {
    // const querySnapshot = await getDocs(collection(db, "sign-ins"));
    // console.log(querySnapshot.docs[0])
    // console.log(querySnapshot.docs[0].data())

    let i = 0;
  const makeDataLevel = (depth = 0) => {
    const len = lens[depth]
    return range(len).map(d => {
      return {
        ...newPerson(i += 1),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      }
    })
  }

    // testQuery()

  return makeDataLevel()
}

// export default async function makeData(...lens) {
//     const querySnapshot = await getDocs(collection(db, "sign-ins"));
//     console.log(querySnapshot.docs[0])
//     console.log(querySnapshot.docs[0].data())

//     // var dataArr = new Array();

//     // const makeDataLevel = (depth = 0) => {
//     //     let dataRow = lens[depth]

//     //     dataRow = {
//     //         ...querySnapshot.docs[depth].data(),
//     //         subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
//     //     }

//     //     console.log(dataRow)

//     // }

//     let i = 0
//     const makeDataLevel = (depth = 0) => {
//         const len = lens[depth]
//         return range(len).map(d => {
//             return {
//                 ...newPerson(i += 1),
//                 subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
//             }
//         })
//     }

//     return makeDataLevel()
// }
