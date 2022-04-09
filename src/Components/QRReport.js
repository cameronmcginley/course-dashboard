import React, { Component, useState, useEffect } from "react";
import QRCodeReact from "qrcode.react";
import "../App.css";
import SplitCourseFullStr from "../Functions/SplitCourseFullStr";

// Using a class component, everything works without issue
export class QRReport extends React.PureComponent {
  constructor(props) {
    super(props);
    this.courseTitleData = SplitCourseFullStr(props.value);
  }

  render() {
    return (
      <div className="qrReport printComponent">
        <h1 className="qrReport title">
          {"Course: " + this.courseTitleData[0]}
        </h1>
        <h2 className="qrReport id">{"ID: " + this.courseTitleData[1]}</h2>
        <QRCodeReact
          renderAs="svg"
          className="qrReport qrCode"
          size={200}
          value={this.props.value}
        />
      </div>
    );
  }
}
