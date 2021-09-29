import React from "react";
import "../Popup.css";
function Confirm(props) {
  return props.triggerClickDelete ? (
    <div className="popup-confirm">
      <div className="popup-inner popup-inner-confirm" style={{ opacity: 1 }}>
        {props.children}
        <center>
          <button className="dismiss-btn" onClick={() => props.clickDismiss()}>
            Dismiss
          </button>
          <button className="confirm-btn" onClick={() => props.deleteEvent()}>
            Confirm
          </button>
        </center>
      </div>
    </div>
  ) : (
    ""
  );
}
export default Confirm;
