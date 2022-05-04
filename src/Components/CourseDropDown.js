import * as React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { FirebaseReadQueries } from "../Functions/FirebaseReadQueries";

function sleep(delay = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const getCourseList = async () => {
  // Get all courses for the dropdown
  // var data = query(collection(db, "courses"), orderBy("courseName"), limit(10));
  const docs = await FirebaseReadQueries({
    type: "courses",
    collectionName: "courses",
    sortKey: "courseName",
  });

  // Only get course, give it a display name with name + id
  let courseList = [];
  docs.forEach((doc) => {
    courseList.push({
      course: doc.data().courseFullStr,
    });
  });

  return courseList;
};

let courseList = []

export default function CourseDropDown(props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const loading = open && options.length === 0;
  // let [courseList, setCourseList] = React.useState([]);

  let [selectedCourses, setSelectedCourses] = React.useState([]);

  React.useEffect(() => {
    let active = true;

    if (!loading) {
      return undefined;
    }

    (async () => {
      // Only re-get course list if it isn't stored already
      // if (!courseList.length) {await setCourseList(await getCourseList());}
      if (!courseList.length) {courseList = await getCourseList()}

      // setTimeout(function () {
      if (active) {
        // const courseList = await getCourseList()
        setOptions(courseList);
      }
      // }, 100);
    })();

    return () => {
      active = false;
    };
  }, [loading]);

  React.useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  // On course select
  // selectedCourse

  return (
    <Autocomplete
      multiple
      // onChange={(e, newVal) => props.selectedCourse(newVal)} //Sends selected value to parent
      // newVal is list of all selected elements
      onChange={(e, newVal) => props.selectedCourse(newVal)}
      // id="asynchronous-demo"
      // sx={{ width: 300 }}

      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
        // props.selectedCourse(selectedCourses)
      }}
      isOptionEqualToValue={(option, value) => option.course === value.course}
      getOptionLabel={(option) => option.course}
      options={options}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Course"
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <React.Fragment>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </React.Fragment>
            ),
          }}
        />
      )}
    />
  );
}
