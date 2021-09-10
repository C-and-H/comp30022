import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
//import { Header } from 'react-native-elements';
import {Button} from "reactstrap";
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
	fontSize : 18,
	textAlign : "left",
	fontFamily:"Comic Sans MS"
	//float:"right"
	//paddingRight : 80
	//padding-left// : 10
}

const valueStyle = {
	//marginTop: 40,
	//padding : 10,
	marginRight: 270,
	fontSize : 18,
	textAlign : "left",
	float : "right",
	fontFamily:"Comic Sans MS"
}

const headerStyle = {
	textAlign : "left",
	fontSize : 28,
	backgroundColor : "#F6FA83"
}

// const imgStyle = {
// 	float: "left",
// 	height: "150px",
// 	width: "180px",
// 	marginRight : 50
// }







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
				hasRegion: false,
				hasGender: false,
				hasCompany: false,
				hasSummary: false,
				
  	  };

	}

	

	// if current user is null, will go back to homepage
  componentDidMount() {
    const currentUser = AuthService.getCurrentUser();
    // if not login
		
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({ currentUser: currentUser, userReady : true });

		// display following if they exist
		if (currentUser.phone.length !== 0) this.setState({hasPhone : true});
		if (currentUser.industry) this.setState({hasIndustry : true});
		if (currentUser.company) this.setState({hasCompany : true});
		if (currentUser.personalSummary) this.setState({hasSummary : true});
		if (currentUser.areaOrRegion) this.setState({hasRegion : true});
    
  }

	

	

	render(){
		
		const {
			currentUser, hasIndustry, hasPhone, hasRegion, hasCompany,
			hasGender, hasSummary 
		} = this.state;
		//const classes = useStyles();
		//console.log(this.state.hasPhone);
		const fullName = currentUser.first_name + " " + currentUser.last_name;
		const mobiles = currentUser.mobiles;
		//const mobiles = ["fda", "fa"];
		if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }
		return(
				
				<div className = "container">
			
					
					<div style={{float: 'right'}}>
            <Button color = "primary" href = "/setting">Edit</Button>
        	</div>
					<h1 style = {headerStyle}>
						Basic Info 
					</h1>
				
					<center>
						<div>
							<div>
								<h1 style = {lineStyle}>Full Name: 
									<span style = {valueStyle}>{fullName}</span>
								</h1>
								
							</div>
							
							
						{hasCompany ?(
						<div>
							<h1 style = {lineStyle}>Company: 
								<span style = {valueStyle}>{currentUser.company}</span>
							</h1>
							
						</div>
						) : (
							<></>
						)}

						{hasIndustry ?(
							<div>
								<h1 style = {lineStyle}>industry: 
									<span style = {valueStyle}>{currentUser.industry}</span>
								</h1>
							
							</div>
						) : (
							<></>
						)}
						{hasRegion ? (
							<div>
							<h1 style = {lineStyle}>Region: 
								<span style = {valueStyle}>{currentUser.areaOrRegion}</span>
							</h1>
							
						</div>
						) : (
						<></>
						)}
						
						{hasSummary ? (
							<div>
								<h1 style = {lineStyle}>Personal Summary: </h1>
								<p style = {{textAlign:"left", marginLeft: 60 }}>
									{currentUser.personalSummary}
								</p>
							</div>
						) : (
							<></>
						)}
						<h1 style = {lineStyle}> </h1>
						<div style={{float: 'right'}}>
            <Button color = "primary" href = "/setting">Edit</Button>
        	</div>
						<h1 style = {headerStyle}>
							Contact details 
						</h1>
						{hasPhone ? (
							<div>
							<h1 style = {lineStyle}>bruh 
              <span style = {valueStyle}>{currentUser.phone}</span>
							{/* {
								mobiles.map((element) => {
									return (
										<p style = {{textAlign :"right", marginRight: 270}}>
										{element}
										</p>
										)
								
								}) */}
							{/* } */}
							</h1>
							</div>
						) : (
							<></>
						)}
						
						<div>
								<h1 style = {lineStyle}>Email: 
									<span style = {valueStyle}>{currentUser.email}</span>
								</h1>
								
							</div>
						
					</div>
					<div>
						{/* <center> */}

							{/* <ContainedButtons />
							{/* <Button className = {classes.root} variant="primary" size = "lg">
								Edit my profile
							</Button> */} 
						{/* </center> */}
					</div>
				</center>
			</div>
			
			
		);


	}
}