import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import AuthService from "../../Services/AuthService";
import {Button, Container, Row, Col, Label} from "reactstrap";
import '../../App.css'

import UserService  from "../../Services/UserService";

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
				isFriend: false,
				icon: "fa fa-user fa-fw",
        btnText: null,
        disableBtn: false
				// fullName: 
				// this.state.currentUser.first_name + " " +this.currentUser.last_name
				//https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png
  	  };
    
    this.friendBtn = this.friendBtn.bind(this);
    this.handleClick = this.handleClick.bind(this);
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

      let friendship = await UserService.checkFriend(
        basic.id,
        this.props.match.params.id,
        basic.token
      );
      this.setState({isFriend: friendship})
			//this.setState({myself:false})
			
		}else{
			//this.setState({currentUser: AuthService.getCurrentUser()});
			currentUser = await AuthService.getCurrentUser();
			this.setState({myself: true})
		}
		
		if (this.state.isFriend){
      this.setState({btnText: "Unfriend"});
    } else {
      this.setState({btnText: "Add friend"});
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
    if (currentUser.icon) this.setState({icon: currentUser.icon});
    
  }

  async handleClick() {
    const {isFriend} = this.state;
    const user = AuthService.getBasicInfo();
    var res;
    if (isFriend) {
      // send delete friend request
      res = await UserService.deleteFriend (
        user.id,
        this.props.match.params.id,
        user.token
      );
      this.setState({btnText: "Add friend"})
    } else {
      // send friend request
      res = await UserService.sentFriendRequest (
        user.id,
        this.props.match.params.id,
        user.token
      );
      this.setState({btnText: "Request sent"});
      //console.log("bruh")
      this.setState({disableBtn: true});
    }
    
    await AuthService.getUserDataFromBackend(user.token, user.id);
  }

	friendBtn(){
    const {btnText, disableBtn} = this.state;
    return (
      <Container>
        <Row>
          <Col></Col>
          <Col xs="6">
            <Button 
              className="profile-display-icon-btn"
              disabled={disableBtn}
              onClick={() => this.handleClick()}
            >
              {btnText}
            </Button>
          </Col>

          <Col></Col>
        </Row>
      </Container>
    )
    
  }

	
	

	render(){
		
		const {
			currentUser, hasIndustry, hasPhone, hasRegion, hasCompany,
			// hasGender,
       hasSummary, myself,  icon, isFriend
		} = this.state;
    console.log(currentUser);
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
											<Button 
                        className="profile-display-icon-btn"
                        href="/changeIcon"
                      >
												Change Icon
											</Button>
										</Col>
										
										<Col></Col>
									</Row>
								) : (
									<Row className="profile-display-line">
                    {this.friendBtn()}
                  </Row>
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