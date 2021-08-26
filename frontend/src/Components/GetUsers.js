import React, { Component } from "react";
import { connect } from "react-redux";

const fetchUserProfiles = async () => {
  await axios.get(API_URL + "/findAllUsers").then((res) => {
    console.log("bruh");
    console.log(res);
    const data = res.data;
  });
};

export class GetUsers extends Component {
  render() {
    return <div></div>;
  }
}
