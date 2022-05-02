import React, { useState } from "react";

import { Button, Box } from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';


export default function DialogConfirmation(props) {
  // Styling
  const [submitBtnColor, setSubmitBtnColor] = useState("primary");
  const [submitBtnText, setSubmitBtnText] = useState("Export All To CSV");
  const [submitBtnDisabled, setSubmitBtnDisabled] = useState(false);
  const [blockingError, setBlockingError] = useState([
    false,
    "Default Error Message",
  ]);

  const [showButton, setShowButton] = useState(false);

  setTimeout(() => {
    setShowButton(true);
  }, 5000)

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
        {/* Confirmation button */}
        {/* Wait n seconds before showing */}
        {showButton && <Button
          variant="outlined"
          onClick={props.sendConfirm}
          color={props.confirmBtnColor}
        >
          {props.buttonTxt}
        </Button>}

        {/* If not shown yet, put loading */}
        {!showButton && <CircularProgress />}
      </Box>
    </div>
  );
}
