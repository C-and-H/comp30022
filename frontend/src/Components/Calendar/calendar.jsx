import React, { Component } from "react";
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import "./Popup.css";
import AuthService from "../../Services/AuthService";
import { Redirect } from "react-router-dom";
import {
  Scheduler,
  WeekView,
  Appointments,
  MonthView,
  Toolbar,
  DateNavigator,
  TodayButton,
  CurrentTimeIndicator
  // AppointmentTooltip
} from '@devexpress/dx-react-scheduler-material-ui';
import Popup from "./Popup";
import Confirm from "./Confirm";
import AutoLinkText from 'react-autolink-text2';

// handle the view switcher
const ExternalViewSwitcher = ({
  currentViewName,
  onChange,
}) => (
  <RadioGroup
    aria-label="Views"
    style={{ flexDirection: 'row' }}
    name="views"
    value={currentViewName}
    onChange={onChange}
  >
    <FormControlLabel value="Week" control={<Radio />} label="Week" />
    <FormControlLabel value="Month" control={<Radio />} label="Month" />
  </RadioGroup>
);

class Calendar extends Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef();
    this.state = {
      redirect: null,
      userReady: false,
      currentUser: localStorage.getItem("user"),
      basic: localStorage.getItem("basic"),
      onClickDelete: false,
      seen: false,
      startTime: "",
      endTime: "",
      data: "",
      currentViewName: 'Week',

    };

    this.currentViewNameChange = (e) => {
      this.setState({ currentViewName: e.target.value });
    };
  }

    // if current user is null, will go back to homepage
    componentDidMount() {
      const currentUser = AuthService.getCurrentUser();
      // if not login
      if (!currentUser) this.setState({ redirect: "/home" });
      this.setState({ currentUser: currentUser, userReady: true });
      // console.log(this.state.currentUser, this.state.basic)
    }


  handleOnClick(event) {
    // var data = event.data
    var startTime = event.data.startDate
    var endTime = event.data.endDate
    // console.log(data)
    var startTimeArray = startTime.toDateString().split(" ");
    var endTimeArray = endTime.toDateString().split(" ");
    var startTimeString = startTimeArray[2] + " " + startTimeArray[1] + " " + startTimeArray[3] + '\xa0\xa0' + startTime.getHours() + ':' + startTime.getMinutes();
    var endTimeString = endTimeArray[2] + " " + endTimeArray[1] + " " + endTimeArray[3] + '\xa0\xa0'+ endTime.getHours() + ':' + endTime.getMinutes();
    // var endTimeString = endTime.getFullYear() + '-' + (endTime.getMonth() + 1) + '-' + endTime.getDate() + ' ' + endTime.getHours() + ':' + endTime.getMinutes();
    this.setState({
      startTime: startTimeString,
      endTime: endTimeString,
      data: event.data,
      seen: true
    });
  }
  //use arrow functions, 
  //as arrow functions point to parent scope and this will be available. 
  //(substitute of bind technique)
  setTriggerClose = () => {
    this.setState({seen: false});
  }

  clickDismiss = () => {
    this.setState({
      onClickDelete: false,
      seen: false
    });
  }

  activateDelete = () =>{
    this.setState({
      onClickDelete: true
    });
  }

  handleOnClickCalendar(event) {
    console.log("do nothing")
  }

  disableShow = ({children, style, ...restProps}) => {
    return (
      <DateNavigator.OpenButton
      onClick={(event) =>
        this.handleOnClickCalendar(event)}
        {...restProps}
      >
      {children}
      </DateNavigator.OpenButton>
    )
  }

  try = ({children, style, ...restProps}) => {
    return (
      <DateNavigator.Root
      rootRef={this.myRef}
        {...restProps}
      >
      {children}
      </DateNavigator.Root>
    )
  }
  appointment = ({children, style, ...restProps}) => {
    return (
    <Appointments.Appointment 
      onClick={(event) =>
        this.handleOnClick(event)}
      {...restProps}
    >
      {children}
    </Appointments.Appointment>
    )
  }

  clickAddEvent = () =>{
    alert("you have click the add event button")
    const redirect = "/setEvent";
    this.setState({ redirect });
  }

  deleteEvent = () =>{
    alert("you have click the delete event button")
    this.setState({
      onClickDelete: false,
      seen: false
    });
  }

  setButton = ({children, style, ...restProps}) =>{
    return (
      <Toolbar.FlexibleSpace>
         <button className="MuiButtonBase-root MuiButton-root calendar-btn" onClick={this.clickAddEvent}> 
          <span class="MuiButton-label">Add Event</span>
         </button>
        {children}
      </Toolbar.FlexibleSpace>
    )
  }

  dateToString = (date) => {
    // var newDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    // var year_month_day = date.toISOString().split('T')[0];
    var time = date.toISOString().split('T')[1].split('.')[0]
    return time;
  }
  render(){
        // if redict is not null imply user is not login, then go to home page
        if (this.state.redirect) {
          return <Redirect to={this.state.redirect} />;
        }
    const { currentViewName } = this.state;
    const currentDate = new Date();
    const appointments = [
            {
            id: "123psad9okajsdnfkasj",
            title: 'Approve New Online Marketing Strategy',
            startDate: new Date(2021, 8, 23, 12, 35),
            endDate: new Date(2021, 8, 23, 14, 15),
            description:"yu wen michael zhang is inviting you to a scheduled Zoom meeting Topic: yu wen michael zhang's Personal Meeting RoomJoin Zoom Meeting https://us05web.zoom.us/j/2314700834?pwd=b0RWQldGNWgwMmp1bmNUNmNaQWNhQT09"
            
          },
          {
            id: "123psaddq98390q2okajsdnfkasj",
            title: 'Sprint 2 meeting',
            startDate: new Date(2021, 8, 23, 14, 35),
            endDate: new Date(2021, 8, 23, 15, 15),
            description:"yu wen michael zhang is inviting you to a scheduled Zoom meeting Topic: yu wen michael zhang's Personal Meeting RoomJoin Zoom Meeting https://us05web.zoom.us/j/2314700834?pwd=b0RWQldGNWgwMmp1bmNUNmNaQWNhQT09 https://stackoverflow.com/questions/44212713/styling-webkit-scrollbar-track-not-working"
            
          },
    ]
    return (
      <React.Fragment>
        <ExternalViewSwitcher currentViewName={currentViewName} onChange={this.currentViewNameChange}/>
        {/* <Button class="calendar-btn">hello</Button> */}
      <div className="calendar">
      <Paper >
        <Scheduler data={appointments} >
          <ViewState defaultCurrentDate={currentDate} currentViewName={currentViewName}/>
          <MonthView/>
          <WeekView startDayHour={9} endDayHour={21}/>
          <Toolbar flexibleSpaceComponent={this.setButton}/>
          <DateNavigator openButtonComponent={this.disableShow}/>
          <TodayButton />
          <Appointments appointmentComponent={this.appointment}/>
          <CurrentTimeIndicator/>
        </Scheduler>

        <Popup trigger={this.state.seen} activateDelete={this.activateDelete} setTriggerClose={this.setTriggerClose} >
          <div>
              <h2 className="popup-header">Title: {this.state.data.title}</h2>
              <div className="show-time">
                <p>
                  <span style={{fontSize:23, fontWeight:600}}>Time:</span>
                  <br /> 
                  {this.state.startTime} — {this.state.endTime}
                </p>  
              </div>
              <p className="description">
                <span style={{fontSize:23, fontWeight:600}}>Description:</span>
                 <br />
                 
                 <div className="div-description">
                 <AutoLinkText text={this.state.data.description}/>
                 </div>  
              </p>
          </div>
        </Popup>

        <Confirm triggerClickDelete={this.state.onClickDelete} clickDismiss={this.clickDismiss} deleteEvent={this.deleteEvent}>
          <h2 style={{textAlign:"center",fontSize:20}}>Are you sure you want to delete this event?</h2>
        </Confirm>
      </Paper>
      </div>
      </React.Fragment>

    );
  }
}
export default Calendar;