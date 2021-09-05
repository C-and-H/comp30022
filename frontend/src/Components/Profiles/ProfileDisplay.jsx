import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
//import {Button} from "reactstrap";
//import ProfileSideBar from "./ProfileSideBar"

import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      // margin: theme.spacing(1),
      margin: 40,
    },
  },
}));

const lineStyle = {
	marginTop: 40,
	padding : 10,
	fontSize : 28
}

function ContainedButtons() {
  const classes = useStyles();
  //const basic = localStorage.getItem("basic");
  return (
    <div className={classes.root}>
      <a href="/setting" className="btn btn-primary btn-homepage" size = "lg" >
        Edit My Profile!
      </a>
    </div>
  );
}



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
		if (currentUser.mobiles.length !== 0) this.setState({hasPhone: true});
		if (currentUser.industry) this.setState({hasIndustry: true});
			
		if (currentUser.areaOrRegion) this.setState({hasRegion: true});
    // console.log(currentUser.industry);
		//console.log(this.state.hasIndustry);	
		// console.log(this.state.redirect);
  }

	

	

	render(){
		//const spaces = "       ";
		
		const {currentUser, hasIndustry, hasPhone, hasRegion} = this.state;
		//const classes = useStyles();
		//console.log(this.state.hasPhone);
		const fullName = currentUser.first_name + " " + currentUser.last_name;
		if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
		return(
				<div className = "container">
					<div>
						<h1 style = {lineStyle}>Full Name: {fullName}</h1>
						<h1 style = {lineStyle}>Email: {currentUser.email}</h1>
						{hasPhone ? (
						<h1 style = {lineStyle}>Phone: {currentUser.mobiles}</h1>
					) : (
						<></>
					)}
					{hasIndustry ?(
						<h1 style = {lineStyle}>Industry: {currentUser.industry}</h1>
					) : (
						<></>
					)}
					{hasRegion ? (
						<h1 style = {lineStyle}>Region: {currentUser.areaOrRegion}</h1>
					) : (
					<></>
					)}
					
				</div>
				<div>
					<center>

						<ContainedButtons />
						{/* <Button className = {classes.root} variant="primary" size = "lg">
							Edit my profile
						</Button> */}
					</center>
				</div>
			</div>
			
			
		);


	}
}