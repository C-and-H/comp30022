import React, { Component, useState } from "react";
// import {Inject, Day, Week, WorkWeek, Month, Agenda, ScheduleComponent} from "@syncfusion/ej2-react-schedule";
import Paper from '@material-ui/core/Paper';
import { ViewState } from '@devexpress/dx-react-scheduler';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import "./Popup.css"
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
import { BorderBottom } from "@material-ui/icons";

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
    {/* <FormControlLabel value="Work Week" control={<Radio />} label="Work Week" /> */}
    <FormControlLabel value="Month" control={<Radio />} label="Month" />
  </RadioGroup>
);

class Calendar extends Component {
  constructor(props) {
    super(props)
    this.myRef = React.createRef();
    this.state = {
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

  handleOnClick(event) {
    var data = event.data
    var startTime = event.data.startDate
    var endTime = event.data.endDate
    console.log(data)
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
  setTrigger = () => {
    this.setState({seen: false});
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
    // onVisibilityToggle={
    //   () => {}
    // }
    // visible={false}
      onClick={(event) =>
        this.handleOnClick(event)}
      {...restProps}
    >
      {children}
    </Appointments.Appointment>
    )
  }


  dateToString = (date) => {
    // var newDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes();
    // var year_month_day = date.toISOString().split('T')[0];
    var time = date.toISOString().split('T')[1].split('.')[0]
    return time;
  }
  render(){
    
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
            description:"yu wen michael zhang is inviting you to a scheduled Zoom meeting Topic: yu wen michael zhang's Personal Meeting RoomJoin Zoom Meeting https://us05web.zoom.us/j/2314700834?pwd=b0RWQldGNWgwMmp1bmNUNmNaQWNhQT09"
            
          },
    ]
    return (
      <React.Fragment>
        <ExternalViewSwitcher currentViewName={currentViewName} onChange={this.currentViewNameChange}/>
      <Paper >
        <Scheduler data={appointments} >
          <ViewState defaultCurrentDate={currentDate} currentViewName={currentViewName}/>
          <MonthView/>
          <WeekView startDayHour={9} endDayHour={21}/>
          <Toolbar/>
          <DateNavigator openButtonComponent={this.disableShow}/>
          <TodayButton />
          <Appointments appointmentComponent={this.appointment}/>
          <CurrentTimeIndicator/>
        </Scheduler>
        <Popup trigger={this.state.seen} setTriggerBtn={this.setTrigger}>
          <div>
              <h2 className="popup-header">Title: {this.state.data.title}</h2>
              <div className="show-time">
                <p><span style={{fontSize:23}}>Time:</span><br /> {this.state.startTime} — {this.state.endTime}</p>  
              </div>
              <p className="description"><span style={{fontSize:23}}>Description:</span> <br /> {this.state.data.description}</p>
          </div>
      </Popup>
      </Paper>
      </React.Fragment>

    );
  }
}
export default Calendar;
      // <CSSTransition nodeRef={this.buttonRef} in timeout={200} classNames="fade">
        // <div ref={this.buttonRef}>
              // </div>
      // </CSSTransition>