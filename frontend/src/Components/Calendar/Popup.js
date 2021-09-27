import React from "react";
import "./Popup.css"
function Popup(props) {
  return (props.trigger) ? (
    <div className="popup-background">
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn"
        onClick={() => props.setTriggerClose()}>&times;</button>
        {props.children}
        <center>
        <button className="delete-btn"
        onClick={() => props.activateDelete()}>Delete Event</button></center>
      </div>
    </div>
    </div>
  ) : "";
}
export default Popup