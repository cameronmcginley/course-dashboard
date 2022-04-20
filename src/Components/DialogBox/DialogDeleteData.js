import React, { useState } from "react";

import { getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase-config";
import { FirebaseReadQueries } from "../../Functions/FirebaseReadQueries";
import { CircularProgress, Box } from "@mui/material";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { endOfDay } from "date-fns";
import DialogHandler from "./DialogHandler";
import getSortKey from "../../Functions/getSortKey";

export default function DialogDeleteData(props) {
  // Styling
  const [submitBtnColor, setSubmitBtnColor] = useState("primary");
  const [submitBtnText, setSubmitBtnText] = useState("Export All To CSV");
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [blockingError, setBlockingError] = useState([
    false,
    "Default Error Message",
  ]);

  const [date, setDate] = useState(null);
  const [dateStr, setDateStr] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [isDoneLoading, setDoneLoading] = useState(false);

  const buttonClickSuccess = () => {
    setSubmitBtnColor("success");
    setSubmitBtnText("Success");
    setSubmitBtnDisabled(true);
  };

  const buttonClickFail = (errMsg) => {
    setSubmitBtnColor("error");
    setSubmitBtnText("Error");
    setSubmitBtnDisabled(true);
    setTimeout(function () {
      setSubmitBtnColor("primary");
      setSubmitBtnText("Export All To CSV");
      setSubmitBtnDisabled(false);
      setBlockingError([false, ""]);
    }, 2000);
  };

  const handleDateSelect = (dateSelected) => {
    setDate(dateSelected);
    setDateStr(dateSelected.toDateString());
  };

  const deleteData = async () => {
    setIsLoading(true);
    // props.hasCloseBtn = false
    setTimeout(function () {
      setIsLoading(false);
      setDoneLoading(true);
    }, 5000);

    console.log("Deleting data on and before: ", endOfDay(date));
    console.log(getSortKey(endOfDay(date)));

    const data = await FirebaseReadQueries({
      type: "DeleteArchivedBeforeDate",
      searchCriteria: { deleteDate: getSortKey(endOfDay(date)) },
    });

    var documentSnapshots = await getDocs(data);

    await documentSnapshots.forEach((docSnapshot) => {
      let docRef = doc(db, "sign-ins", docSnapshot.id);
      deleteDoc(docRef);

      // console.log((new Date(docSnapshot.data().timestampLogged.seconds*1000)).toDateString())
    });
  };

  return (
    <div>
      <p>
        All previously archived data on and before the selected day will be
        permanently deleted.
      </p>
      <p>Date Selected: {dateStr}</p>

      {isLoading && <CircularProgress />}

      {!isLoading && !isDoneLoading && (
        <>
          <DialogHandler
            type="dateRangePicker"
            sendDateRangeUp={handleDateSelect}
            noCloseBtn={false}
            isSingleDate={true}
          />

          <div className="break" />

          {/* Box to center just the delete button */}
          <Box textAlign="center" sx={{ mt: 2, mb: 3 }}>
            <DialogHandler
              type="confirmation"
              message="Are you sure you wish to delete all data archived before"
              noCloseBtn={false}
              sendConfirm={deleteData}
              dialogBtnColor="error"
              confirmBtnColor="error"
              buttonTxt="delete"
            />
          </Box>
        </>
      )}

      {isDoneLoading && <p>yo</p>}

      {/* <Button variant="outlined">Delete</Button> */}
    </div>
  );
}
