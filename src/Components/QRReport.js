import React, { Component, useState, useEffect } from "react";
import QRCodeReact from "qrcode.react";
import "../App.css";

// Using a class component, everything works without issue
export class QRReport extends React.PureComponent {
  render() {
    return (
      <div className="qrReport printComponent">
          <h1 className="qrReport title">{"Course: " + this.props.coursename}</h1>
          <h2 className="qrReport id">{"ID: " + this.props.value}</h2>
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
