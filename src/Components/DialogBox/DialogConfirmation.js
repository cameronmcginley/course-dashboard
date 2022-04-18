import React, { useState } from "react";

import { Button, Box } from "@mui/material";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

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

  return (
    <div>
      <p>{props.message}</p>

      <Box textAlign="center" sx={{ mt: 2, mb: 3 }}>
        <Button
          variant="outlined"
          onClick={props.sendConfirm}
          color={props.confirmBtnColor}
        >
          {props.buttonTxt}
        </Button>
      </Box>
    </div>
  );
}
