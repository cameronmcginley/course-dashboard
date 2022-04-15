import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import { IconButton } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { QRReport } from "./QRReport";

const PrintQRReport = (props) => {
  const componentRef = useRef();
  console.log(props);

  return (
    <div>
      <ReactToPrint
        trigger={() => 
        <IconButton>
          <PrintIcon />
        </IconButton>
        }
        content={() => componentRef.current}
      />
      <QRReport
        ref={componentRef}
        value={props.value}
        coursename={props.coursename}
      />
    </div>
  );
};

export default PrintQRReport;
