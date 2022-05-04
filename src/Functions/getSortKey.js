import { Timestamp } from "firebase/firestore";

// Takes in JS Date or Firebase Timestamp
// sortKey is essentially an inverted date in seconds
// Firebase handles ascending order better than descending, so
// sorts by sortKey to handle date sorting/searching
const getSortKey = (dateToConvert) => {
  // If Timestamp, convert to JS Date
  // If JS Date, do nothing
  if (dateToConvert instanceof Timestamp) {
    dateToConvert = new Date(dateToConvert.seconds*1000)
  }

  // getTime returns date in ms
  const dateSeconds = dateToConvert.getTime() / 1000;
  return 9999999999999 - dateSeconds;
};

export default getSortKey;
