import React, { Component, useState, useEffect } from "react";
import "./QrPrint.css";
import QRCodeReact from 'qrcode.react'

// Using a class component, everything works without issue
export class QrPrint extends React.PureComponent {
    render() {
      return (
        <div className='printComponent'>
          <h1 className="printCompTitle">Course Title</h1>
          <h2 className="printCompID">Course ID</h2>
          <QRCodeReact renderAs="svg" className="printCompQR" size={200} value={"123"} />
        </div>
      );
    }
  }
