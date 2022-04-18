// Takes in CourseFullStr, returns [courseName, courseID] both as string
const SplitCourseFullStr = (courseFullStr) => {
  console.log("Splitting course full str", courseFullStr);
  // Format: "<course name> (ID <id>)"
  let regExp = /\(([^)]+)\)/;
  let idStr = regExp.exec(courseFullStr); // idStr[1] == ID <id>
  let id = idStr[1].split(" ");

  // Replaces everything between and including the parans
  let name = courseFullStr.replace(/ *\([^)]*\) */g, "");
  name = name.trim();

  return [name, id[1]];
};

export default SplitCourseFullStr;
