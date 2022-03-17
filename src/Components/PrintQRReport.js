import React, { useRef } from "react";
import ReactToPrint from "react-to-print";

import { QRReport } from "./QRReport";

const PrintQRReport = (props) => {
  const componentRef = useRef();
  console.log(props);

  return (
    <div>
      <ReactToPrint
        trigger={() => <button>Print</button>}
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
