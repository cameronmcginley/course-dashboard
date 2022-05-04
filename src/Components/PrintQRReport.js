import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { QRReport } from "./QRReport";

const PrintQRReport = (props) => {
  const componentRef = useRef();

  return (
    <div>
      <ReactToPrint
        trigger={() => (
          <IconButton>
            <PrintIcon />
          </IconButton>
        )}
        content={() => componentRef.current}
      />
      <QRReport
        ref={componentRef}
        QRvalue={props.QRvalue}
        courseData={props.courseData}
      />
    </div>
  );
};

export default PrintQRReport;
