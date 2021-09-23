import React from "react";
import "./Popup.css"
function Popup(props) {
  return (props.trigger) ? (
    <div className="popup">
      <div className="popup-inner">
        <button className="close-btn"
        onClick={() => props.setTriggerBtn()}>&times;</button>
        {props.children}
        <button className="delete-btn"
        onClick={() => props.setTriggerBtn()}>Delete Event</button>
      </div>
    </div>
  ) : "";
}
export default Popup