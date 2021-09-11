import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
//import { Header } from 'react-native-elements';
import {Button, Container, Row, Col} from "reactstrap";
import '../../App.css'

//import ProfileSideBar from "./ProfileSideBar"


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
        //currentUser: localStorage.getItem("user"),
				currentUser: null,
        basic: localStorage.getItem("basic"),
				hasPhone: false,
				hasIndustry: false,
				hasRegion: false,
				hasGender: false,
				hasCompany: false,
				hasSummary: false,
				bruh:false,
				myself: false
				// fullName: 
				// this.state.currentUser.first_name + " " +this.currentUser.last_name
				//https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png
  	  };

	}

	

	// if current user is null, will go back to homepage
  async componentDidMount() {
		const basic = AuthService.getBasicInfo();
		var currentUser;
		//console.log(this.props.match.params.id);
		if (this.props.match.params.id){
			currentUser = await AuthService.getUserDataFromBackend(
				basic.token, this.props.match.params.id
			
			);
			//this.setState({myself:false})
			
		}else{
			//this.setState({currentUser: AuthService.getCurrentUser()});
			currentUser = await AuthService.getCurrentUser();
			this.setState({myself: true})
		}
		
		
		
    //console.log(cur	rentUser);
    // if not login
		
    if (!currentUser) this.setState({ redirect: "/home" });
    this.setState({currentUser: currentUser, userReady : true });

		// display following if they exist
		if (currentUser.phone) this.setState({hasPhone : true});
		if (currentUser.industry) this.setState({hasIndustry : true});
		if (currentUser.company) this.setState({hasCompany : true});
		if (currentUser.personalSummary) this.setState({hasSummary : true});
		if (currentUser.areaOrRegion) this.setState({hasRegion : true});
    
  }

	

	

	render(){
		
		const {
			currentUser, hasIndustry, hasPhone, hasRegion, hasCompany,
			// hasGender,
       hasSummary, myself
		} = this.state;
		//const classes = useStyles();
		//console.log(this.state.hasPhone);
		
		//const fullName = currentUser.first_name + " " + currentUser.last_name;
		// const mobiles = currentUser.mobiles;
		//const mobiles = ["fda", "fa"];
		if (this.state.redirect) {
      return <Redirect to={this.state.redirect} />;
    }

		if (!currentUser){
			return <div></div>;
		}
		const fullName = currentUser.first_name + " " + currentUser.last_name;
		console.log(currentUser);
		console.log(fullName);
		return(
				
				<Container>
						<h4 className = "profileDispay-line">
							{fullName}
						</h4>
					
						{myself ? (
							<div style={{float: 'right'}}>
								<Button color = "primary" href = "/setting">Edit</Button>
							</div>
						) : (
							<></>
						)}
					
					<h1 style = {headerStyle}>
						Basic Info 
					</h1>
				
					<center>
						<div>
							<div>
								<h1 >Full Name: 
									<span style = {valueStyle}>{fullName}</span>
								</h1>
								
							</div>
							
							
						{hasCompany ?(
						<div>
							<h1 style = {lineStyl}>Company: 
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

						
						{myself ? (
							<div style={{float: 'right'}}>
								<Button color = "primary" href = "/setting">Edit</Button>
							</div>
						) : (
							<></>
						)}
            
        	
						<h1 style = {headerStyle}>
							Contact details 
						</h1>
						{hasPhone ? (
							<div>
							<h1 style = {lineStyle}>Phone Number: 
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
			</Container>
			
			
		);


	}
}