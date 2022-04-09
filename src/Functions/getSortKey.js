import react from "react";

// Takes in CourseFullStr, returns [courseName, courseID] both as string
const getSortKey = (dateToConvert) => {
  console.log("Converting to sortkey");
  return 9999999999999 - dateToConvert;
};

export default getSortKey;
