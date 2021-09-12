import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
//import { Header } from 'react-native-elements';
import {Button, Container, Row, Col, Label} from "reactstrap";
import '../../App.css'
import { WiAlien } from "react-icons/wi";

//import ProfileSideBar from "./ProfileSideBar"


// const imgStyle = {
// 	float: "left",
// 	height: "150px",
// 	width: "180px",
// 	marginRight : 50
// }



const iconStyle = {
	marginTop: 40,
	marginLeft: 50,
	fontSize: 200
}



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
				myself: false,
				reRender: false,
				icon: "fa fa-user fa-fw"
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
			currentUser = await AuthService.getOtherUser(
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
    this.setState({
										currentUser: currentUser, 
										userReady : true,
										id: currentUser.id
									});	

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
       hasSummary, myself, reRender, icon
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
		// console.log(currentUser);
		// console.log(fullName);
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
							<Button className = "profile-display-edit-btn" href="/setting">
								Edit My Profile!
							</Button>
						</Col>
						) : (
						<></>
					)}
					
				</Row>

				<Row className = "profile-display-inner-container">
						<Col>
							<Container>
								<Row>
									<i className={icon} style={iconStyle}></i>
								</Row>
								{myself ? (
									<Row className="profile-display-line">
										<Col></Col>
										<Col xs="6">
											<Button className="profile-display-icon-btn">
												Change Icon
											</Button>
										</Col>
										
										<Col></Col>
									</Row>
								) : (
									<></>
								)}
								
							</Container>
						
						
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
								<Row>
									{hasSummary ? (
										<Col>
											<Label className="profile-display-line">
												Something About Me : 
											</Label>
											<p className = "profile-display-p">
												{currentUser.personalSummary}
											</p>
										</Col>
									) : (
										<></>
									)}
								</Row>
							</Container>
						</Col>
						
				</Row>
				
				<Row className="profile-display-bar">
				
					<Col>
						Contact Detail
					</Col>
					<Col></Col>
					{myself ? (
						<Col>
							<Button className = "profile-display-edit-btn" href="/setting">
								Edit My Profile!
							</Button>
						</Col>
						) : (
						<></>
					)}
					
				</Row>
				
				<Row> 
				 
					<Col>
						<Label className="profile-display-contact-line">
							Email: 
						</Label>
					</Col>
					<Col>
						<Label className="profile-display-contact-value">
							{currentUser.email}
						</Label>
					
					</Col>
				</Row>
				{hasPhone ? (
					<Row> 
				 
					<Col>
						<Label className="profile-display-contact-line">
							Phone Number: 
						</Label>
					</Col>
					<Col>
						<Label className="profile-display-contact-value">
							{currentUser.phone}
						</Label>
					
					</Col>
				</Row>
				) : (
					<></>
				)}
			</Container>
			
			
		);


	}
}