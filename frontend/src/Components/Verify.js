import React from "react";
import axios from "axios";
import { Button } from "reactstrap";
import { useLocation } from "react-router-dom";
import { API_URL } from "../constant";

function Verify() {
  const location = useLocation();
  var isDisabled = false;
  return (
    <div>
      <center>
        <Button disabled={isDisabled} onClick={handler}>
          Click Here To Verify Your Email!
        </Button>
      </center>
    </div>
  );

  async function handler() {
    isDisabled = true;
    await axios
      .get(API_URL + location.pathname)
      .then((response) => {
        if (response.data === "Signup confirm success.") {
          alert("Your email has been verified! Please login.");
          window.location = "/login";
        } else {
          alert("Something went wrong");
          window.location = "/";
        }
      })
      .catch((err) => {
        alert("Something went wrong");
        window.location = "/";
      });
  }
}

export default Verify;
