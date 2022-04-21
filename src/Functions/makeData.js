import namor from "namor";
import eachDayOfInterval from "date-fns/eachDayOfInterval";
import { db } from "../firebase-config";
import { FirebaseWriteQueries } from "../Functions/FirebaseWriteQueries";
import { collection, getDocs, query, limit, orderBy } from "firebase/firestore";

const makeData = () => {
  const dates = eachDayOfInterval({
    start: new Date(2000, 9, 6),
    end: new Date(2040, 9, 10),
  });

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
      courseList.push(doc.data().courseFullStr);
    });

    console.log(courseList);
    return courseList;
  };

  function randomDate(start, end, startHour, endHour) {
    var date = new Date(+start + Math.random() * (end - start));
    var hour = (startHour + Math.random() * (endHour - startHour)) | 0;
    date.setHours(hour);
    return date;
  }

  const makeSigninData = async () => {
    let courseList = await getCourseList();
    const IDList = await makeIDList();
    const useIDList = true;

    console.log("Generating data...");

    for (let i = 0; i < 1454; i++) {
      // Random id unless IDList exists
      let userID = null;
      if (!useIDList) {
        userID = namor.generate({ words: 1, numbers: 0 });
      } else {
        userID = IDList[Math.floor(Math.random() * IDList.length)];
      }

      FirebaseWriteQueries({
        collectionName: "sign-ins",
        newUserID: userID,
        newCourseFullStr:
          courseList[Math.floor(Math.random() * courseList.length)],
        timestamp: randomDate(new Date(2015, 0, 1), new Date(), 0, 24),
      });
    }

    console.log("Finished generating data");
  };

  const makeCourseData = async () => {
    for (let i = 0; i < 23; i++) {
      FirebaseWriteQueries({
        collectionName: "courses",
        newCourseName: namor.generate({ words: 1, numbers: 0 }),
        newCourseID: String(Math.floor(Math.random() * 100)),
        timestamp: randomDate(new Date(2015, 0, 1), new Date(), 0, 24),
      });
    }
  };

  const makeIDList = async () => {
    let chars = "1234567890";
    let IDList = [];

    for (let i = 0; i < 50; i++) {
      let result = "";

      // Generate string
      for (let j = 0; j < 5; j++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }

      IDList.push(result);
    }

    console.log(IDList);
    return IDList;
  };

  // makeSigninData()
  // makeCourseData()
}

export default makeData;