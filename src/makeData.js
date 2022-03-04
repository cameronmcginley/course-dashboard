import namor from 'namor'
import moment from 'moment'
import eachDayOfInterval from 'date-fns/eachDayOfInterval'

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
    console.log(i)
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

export default function makeData(...lens) {
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

  return makeDataLevel()
}
