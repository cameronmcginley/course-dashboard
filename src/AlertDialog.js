import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from '@mui/material';
import AsyncCSV from './AsyncCSV';

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  let queries = {
      "userID": null,
      "courseName": null,
      "courseID": null
  }

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Export to CSV
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Optional Queries"}
        </DialogTitle>

        <DialogActions>
            <TextField id="outlined-basic" label="User ID" variant="outlined" 
                onChange={
                    (e) => { queries.userID = e.target.value
                }}/>

            <TextField id="outlined-basic" label="Course Name" variant="outlined" 
                onChange={
                    (e) => { queries.courseName = e.target.value
                }}/>

            <TextField id="outlined-basic" label="Course ID" variant="outlined" 
                onChange={
                    (e) => { queries.courseID = e.target.value
                }}/>

          <Button onClick={handleClose} color="primary" autoFocus>
            Close
          </Button>

          <AsyncCSV queries={queries}/>

        </DialogActions>
      </Dialog>
    </div>
  );
}
