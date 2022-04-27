import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";

import DialogExportCSV from "./DialogExportCSV";
import DialogCourseEntry from "./DialogCourseEntry";
import DialogCourseEdit from "./DialogCourseEdit";
import "../../App.css";
import DialogDeleteData from "./DialogDeleteData";
import DialogDateRangePicker from "./DialogDateRangePicker";
import DialogConfirmation from "./DialogConfirmation";
import { Box } from "@mui/material";

export default function DialogHandler(props) {
  const [open, setOpen] = React.useState(false);
  const [dateButtonText, setDateButtonText] = React.useState("Select Date");
  // const [dialogBtnColor, setDialogBtnColor] = React.useState("primary")
  // const loading = open && courseList.length === 0;

  let handleClickOpen = async () => {
    setOpen(true);
    // Only generate course list when opened
    // setCourseList(await getCourseList());
    // console.log(courseList);
  };

  function handleClose(event, reason) {
    if (reason && reason == "backdropClick") {
      return;
    }
    setOpen(false);
  }

  // let testFunc = (data) => {
  //   props.dateRange = data;
  // }

  // Response from DialogDateRangePicker
  // Closes the dialog, then redirects to function
  // provided by the caller of the date picker
  const onDateSelect = (data) => {
    // Send the selected date(s) to FirebaseDataTableSearch
    props.sendDateRangeUp(data);

    // Set the button text to include the selection
    // Only do for the date range buttons, single date select
    // is displayed elsewhere on delete data dialog
    if (Array.isArray(data)) {
      setDateButtonText(
        "Selected: " +
          data[0].startDate.toLocaleDateString("en-US") +
          " - " +
          data[0].endDate.toLocaleDateString("en-US")
      );
    }

    handleClose();
  };

  // Response from DialogConfirmation
  // Closes the dialog, then redirects to function
  // provided by the caller of the confirmation box
  const onConfirm = (data) => {
    props.sendConfirm();
    handleClose();
  };

  // Contains multiple types depending on passed in prop
  return (
    <div>
      {/* If props.dialogBtnColor isn't set it defaults to "primary" */}
      <Button
        variant="outlined"
        color={props.dialogBtnColor}
        onClick={handleClickOpen}
        // Only full width on the date picker in search box
        fullWidth={props.fullWidth}
      >
        {props.type === "csvExport" && "Export to CSV"}
        {props.type === "courseEntry" && "Add New Course"}
        {props.type === "courseEdit" && "Edit Course"}
        {props.type === "deleteData" && "Delete Archived Data"}
        {props.type === "dateRangePicker" && dateButtonText}
        {props.type === "confirmation" && "Delete"}
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Dialog Title"}</DialogTitle>

        <DialogActions>
          <Box 
            className="dialogMain"
            sx={{
              padding: "2rem",
              minWidth: "20rem",
            }}  
          >
            {/* Handles things scpecific to type of dialog box */}
            {props.type === "csvExport" && <DialogExportCSV />}
            {props.type === "courseEntry" && <DialogCourseEntry />}
            {props.type === "courseEdit" && (
              <DialogCourseEdit
                currCourseName={props.currCourseName}
                currCourseID={props.currCourseID}
                currCourseInstructor={props.currCourseInstructor}
                currSponsorAgency={props.currSponsorAgency}
                currInstructorAgency={props.currInstructorAgency}
                currCoordinator={props.currCoordinator}
                currSynopsis={props.currSynopsis}
              />
            )}
            {props.type === "deleteData" && <DialogDeleteData />}
            {/* Passes dateRange from DialogDateRangePicker to its caller */}
            {props.type === "dateRangePicker" && (
              <DialogDateRangePicker
                isSingleDate={props.isSingleDate}
                sendDateRangeUp={onDateSelect}
              />
            )}
            {props.type === "confirmation" && (
              <DialogConfirmation
                message={props.message}
                sendConfirm={onConfirm}
                confirmBtnColor="error"
                buttonTxt="delete"
              />
            )}

            {/* Hide close button date pickers, custom select button instead */}
            {!props.noCloseBtn && (
              <Button variant="outlined" onClick={handleClose} color="error" autoFocus sx={{mt: "2rem"}}>
                Cancel
              </Button>
            )}
          </Box>
        </DialogActions>
      </Dialog>
    </div>
  );
}
