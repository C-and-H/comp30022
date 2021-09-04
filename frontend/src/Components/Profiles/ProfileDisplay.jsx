import React, { Component } from "react";
//import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
//import ProfileSideBar from "./ProfileSideBar"

export default class ProfileDisplay extends Component{
	constructor(props) {
		super(props);

      this.state = {
        redirect: null,
        userReady: false,
        currentUser: localStorage.getItem("user"),
        basic: localStorage.getItem("basic"),
				hasPhone: false,
				hasIndustry: false,
				hasRegion: false
  	  };

	}


	// if current user is null, will go back to homepage
  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    // if not login
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady: true });
		if (currentUser.mobiles) this.setState({hasPhone: true});
		if (currentUser.industry) this.setState({hasIndustry: true});
		if (currentUser.areaOrRegion) this.setState({hasRegion: true});
    // console.log(this.state.currentUser, this.state.basic)
  }

	

	render(){
		//const spaces = "       ";
		const {currentUser} = this.state;
		const fullName = currentUser.first_name + " " + currentUser.last_name;
		return(
			<div>
				<h1>Full Name: {fullName}</h1>
				<h1>Email: {currentUser.email}</h1>
				{this.hasPhone ? (
					<h1>Phone: {currentUser.mobiles}</h1>
				) : (
					<></>
				)}
				{this.hasIndustry ?(
					<h1>Industry: {currentUser.industry}</h1>
				) : (
					<></>
				)}
				{this.hasRegion ? (
					<h1>Region: {currentUser.areaOrRegion}</h1>
				) : (
				<></>
				)}
			</div>
		);


	}
}