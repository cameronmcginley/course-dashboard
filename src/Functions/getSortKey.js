import { Timestamp } from "firebase/firestore";

// Takes in JS Date
// Converts to Firebase timestamp, then gets key
const getSortKey = (dateToConvert) => {
  console.log("Converting to sortkey");

  // Check if it's already in Timestamp obj
  if (dateToConvert instanceof Timestamp) {
    console.log("Already Timestamp instance...");
  } else {
    dateToConvert = Timestamp.fromDate(dateToConvert);
  }

  return 9999999999999 - dateToConvert;
};

export default getSortKey;
