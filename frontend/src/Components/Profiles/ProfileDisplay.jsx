import React, { Component } from "react";
import { Redirect } from "react-router-dom";
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
		if (currentUser.mobiles.length != 0) this.setState({hasPhone: true});
		if (currentUser.industry) this.setState({hasIndustry: true});
			
		if (currentUser.areaOrRegion) this.setState({hasRegion: true});
    // console.log(currentUser.industry);
		//console.log(this.state.hasIndustry);	
		// console.log(this.state.redirect);
  }

	

	render(){
		//const spaces = "       ";
		const {currentUser, hasIndustry, hasPhone, hasRegion} = this.state;
		
		//console.log(this.state.hasPhone);
		const fullName = currentUser.first_name + " " + currentUser.last_name;
		if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
		return(
			<div>
				<h1>Full Name: {fullName}</h1>
				<h1>Email: {currentUser.email}</h1>
				{hasPhone ? (
					<h1>Phone: {currentUser.mobiles}</h1>
				) : (
					<></>
				)}
				{hasIndustry ?(
					<h1>Industry: {currentUser.industry}</h1>
				) : (
					<></>
				)}
				{hasRegion ? (
					<h1>Region: {currentUser.areaOrRegion}</h1>
				) : (
				<></>
				)}
			</div>
		);


	}
}