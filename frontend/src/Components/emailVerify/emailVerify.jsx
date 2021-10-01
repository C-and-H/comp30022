import React, { Component } from "react";
import "./emailVerify.css";

class EmailVerify extends Component {
  render() {
    return (
      <div className="div-verify-background">
        <p className="p-click-instruction">Click Here to Verify ➜</p>
        <div className="div-animate-circle" />
        <button className="btn-verify" />
      </div>
    );
  }
}

export default EmailVerify;
