import React, { useRef } from 'react';
import ReactToPrint from 'react-to-print';

import { QrPrint } from './QrPrint';

const PrintQRReport = (props) => {
  const componentRef = useRef();
  console.log(props)

  return (
    <div>
      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      />
      <QrPrint 
      ref={componentRef} 
      value={props.value}
      coursename={props.coursename}/>
    </div>
  );
};

export default PrintQRReport