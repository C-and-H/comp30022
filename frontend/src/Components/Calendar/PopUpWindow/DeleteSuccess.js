import React from "react";
import "../Popup.css"
function DeleteSuccess(props) {
  return (props.trigger) ? (
    <div className="popup-confirm">
      <div className="popup-inner popup-success-inner" style={{opacity:1}}>
        {props.children}
        <center>
          <button className="dismiss-btn dismiss-btn-success"
            onClick={() => props.dismissSuccessPopUp()}>Dismiss</button>
        </center>
      </div>
    </div>
  ) : "";
}
export default DeleteSuccess