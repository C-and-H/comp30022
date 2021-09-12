import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
//import { Header } from 'react-native-elements';
import {Button, Container, Row, Col, Label} from "reactstrap";
import '../../App.css'
import AutoFitImage from 'react-image-autofit-frame';
import { WiAlien } from "react-icons/wi";
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
				<Row className = "profile-display-header">
					{fullName}
				</Row>
				<Row className="profile-display-bar">
				
					<Col>
						Basic Info
					</Col>
					<Col></Col>
					{myself ? (
						<Col>
							<Button className = "profile-display-edit-btn">
								Edit My Profile!
							</Button>
						</Col>
						) : (
						<></>
					)}
					
				</Row>

				<Row className = "profile-display-inner-container">
						<Col>
							<WiAlien size={350}/>
						</Col>
						<Col xs="8">
							<Container>
								<Row> 
									<Col>
										<Label className="profile-display-line">
											Industry: 
										</Label>
									</Col>

									<Col>
										{hasIndustry ? (
											<Label className="profile-display-value">
												{currentUser.industry}
											</Label>
										) : (
											<Label className="profile-display-value">
												Not set!
											</Label>
										)}
									</Col>
								</Row>
								<Row>
									<Col>
										<Label className="profile-display-line">
											Company:
										</Label>
									</Col>
									<Col>
										{hasCompany ? (
											<Label className="profile-display-value">
												{currentUser.company}
											</Label>
										) : (
											<Label className="profile-display-value">
												Not set!
											</Label>
										)}
									</Col>
								</Row>
								<Row>
									<Col>
										<Label className="profile-display-line">
											Region:
										</Label>
									</Col>
									<Col>
										{hasRegion ? (
											<Label className="profile-display-value">
												{currentUser.areaOrRegion}
											</Label>
										) : (
											<Label className="profile-display-value">
												Not set!
											</Label>
										)}
									</Col>
								</Row>
							</Container>
						</Col>
						
				</Row>
					
						
			</Container>
			
			
		);


	}
}